from flask import render_template, stream_with_context, current_app
import io
import base64
import os
from langchain_core.documents import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_elasticsearch import ElasticsearchStore
from elasticsearch_client import elasticsearch_client
import PyPDF2


ELSER_MODEL = os.getenv("ELSER_MODEL", ".elser_model_2")

@stream_with_context
def load_pdf(file, title, session_id, id):
    total_size = os.fstat(file.fileno()).st_size
    binary_data = file.read()
    encoded_binary_data = base64.b64encode(binary_data).decode('utf-8')
    pdf_reader = PyPDF2.PdfReader(io.BytesIO(binary_data))
    content=""
    documents=[]
    for page in range(len(pdf_reader.pages)):
        page_obj = pdf_reader.pages[page]
        text = page_obj.extract_text()
        content+=text
        metadata = {"title":title,"page":page+1, "session_id":session_id, "server_Id":id}
        documents.append(Document(page_content=text,metadata=metadata))

    text_splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
        chunk_size=384, chunk_overlap=64
    )
    docs = text_splitter.transform_documents(documents)

    yield f"data: [PROGRESS] 0.1\n\n"

    for index,doc in enumerate(docs):
        ElasticsearchStore.from_documents(
            [doc],
            es_connection=elasticsearch_client,
            index_name="upload-"+id,
            strategy=ElasticsearchStore.SparseVectorRetrievalStrategy(model_id=ELSER_MODEL),
            bulk_kwargs={
                "request_timeout": 600000,
            },
        )   
        progress = ((index + 1) / len(docs) * 0.9) + 0.1
        yield f"data: [PROGRESS] {progress}\n\n"

    # yield f"data: [PROGRESS] {progress}\n\n"
    yield f"data: {id}\n\n"