from flask import Flask, jsonify, request, Response, stream_with_context, send_from_directory
from flask_cors import CORS
from uuid import uuid4
from chat import ask_question
import os
import sys
from query_pdf.pdf_chat import pdf_ask_question
from query_sheet.sheet_chat_pandas_ai import sheet_ask_question_pandas_ai
from generate.generate_ppt import generate_ppt
from elasticsearch_client import elasticsearch_client
from file_loader.pdf_loader import load_pdf
from file_loader.sheet_loader import load_csv_xlsx_xls
from value_map import UPLOAD_PATH
import time


app = Flask(__name__, static_folder="../frontend/build", static_url_path="/")
CORS(app)
# socketio = SocketIO(app, cors_allowed_origins="http://localhost:3000")
ELSER_MODEL = os.getenv("ELSER_MODEL", ".elser_model_2")

@app.route("/")
def api_index():
    return app.send_static_file("index.html")


@app.route("/api/chat", methods=["POST"])
def api_chat():
    request_json = request.get_json()
    question = request_json.get("question")
    if question is None:
        return jsonify({"msg": "Missing question from request JSON"}), 400
    
    session_id = request.args.get("session_id", str(uuid4()))
    action = request_json.get("action", "initial")
    chat_mode = request_json.get("chat_mode", "lexi_chat")
    llm_model = request_json.get("llm_model","")
    semantic_enable = request_json.get("semantic_toggle",True)
    results_size = request_json.get("results_size", 20)
    results_page = request_json.get("results_page",0)
    filters = request_json.get("filters", {})
    files = request_json.get("files", [])
    context = request_json.get("context", {})
    start_time=time.time()

    if action == "chat":
        if question == "Generate PPT":
            return Response(generate_ppt(session_id, start_time), mimetype="text/event-stream")
        elif chat_mode=="doc_chat":
            return Response(pdf_ask_question(question, session_id, files, start_time), mimetype="text/event-stream")
        elif chat_mode=="analyser":
            return Response(sheet_ask_question_pandas_ai(question, session_id, files, start_time), mimetype="text/event-stream")
        else:
            return Response(ask_question(question, session_id, action, llm_model, semantic_enable, results_size, results_page, filters, start_time), mimetype="text/event-stream")      
    else:
        return Response(ask_question(question, session_id, action, llm_model, semantic_enable, results_size, results_page, filters, start_time), mimetype="text/event-stream")


@app.cli.command()
def create_index():
    """Create or re-create the Elasticsearch index."""
    basedir = os.path.abspath(os.path.dirname(__file__))
    sys.path.append(f"{basedir}/../")

    from data import index_data

    index_data.main()

@app.route('/api/upload', methods=['POST'])
def upload_file():
    def generate():
        if 'files' not in request.files:
            yield 'No file part\n'
            return
        file = request.files['files']
        if file.filename == '':
            yield 'No selected file\n'
            return
        if file:
            session_id = request.args.get("session_id", str(uuid4()))
            yield f"data: [SESSION_ID] {session_id}\n\n"
            title= file.filename
            id = (str(uuid4()) + '_' + title).lower().replace(" ", "_")
            # file.save(os.path.join(upload_path, id))
            mimeType = file.mimetype
            _, extension = os.path.splitext(title)
            if extension in [".csv", ".xlsx", ".xls"]:
                for data in load_csv_xlsx_xls(file, title, session_id, id):
                    yield data
            if extension == ".pdf":
                for data in load_pdf(file, title, session_id, id):
                    yield data
    return Response(stream_with_context(generate()), mimetype='text/event-stream')

@app.route('/api/delete/<file_id>', methods=['DELETE'])
def delete_file(file_id):
    if file_id:
        _, extension = os.path.splitext(file_id)
        if extension in [".csv", ".xlsx", ".xls"]:
            os.remove(os.path.join(UPLOAD_PATH, file_id))
        if extension == ".pdf":
            elasticsearch_client.indices.delete(index="upload-"+file_id, ignore_unavailable=True)
        return jsonify(message='File deleted successfully'), 200
    else:
        return jsonify(message='File not found'), 404

# if __name__ == '__main__':
#     socketio.run(app, debug=True)
    
@app.route('/exports/<file_id>', methods=['GET'])
def serve_file(file_id):
    return send_from_directory(os.path.abspath("data/exports"), file_id)


if __name__ == "__main__":
    app.run(port=3001, debug=True)