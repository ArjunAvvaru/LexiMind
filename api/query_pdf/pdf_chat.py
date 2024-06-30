from elasticsearch_client import get_elasticsearch_chat_message_history
from langchain_elasticsearch import ElasticsearchStore
from elasticsearch_client import (elasticsearch_client, get_elasticsearch_chat_message_history)
from query_pdf.pdf_multiquery_retriver import pdf_multi_query_retriever
from query_pdf.pdf_llm_chain import get_pdf_llm_chain
from flask import render_template, stream_with_context, current_app
from value_map import INDEX_CHAT_HISTORY, MSG_SOURCE_TAG, DONE_TAG, CHAT_DONE_TAG, MSG_STATS_TAG
import os
import json
import time


@stream_with_context
def pdf_ask_question(question, session_id, files, start_time=time.time()):
    if not files:
        token = {"token":"Please upload a PDF file to continue."}
        yield f"data: {json.dumps(token)}\n\n"
        yield f"data: {CHAT_DONE_TAG}\n\n"
        yield f"data: {DONE_TAG}\n\n"
        return
    if not all(file.lower().endswith('.pdf') for file in files):
        token = {"token":"Please upload all files in PDF format to continue."}
        yield f"data: {json.dumps(token)}\n\n"
        yield f"data: {CHAT_DONE_TAG}\n\n"
        yield f"data: {DONE_TAG}\n\n"
        return
    
    chat_history = get_elasticsearch_chat_message_history(
        INDEX_CHAT_HISTORY, session_id
    )

    files_index = [ "upload-"+item for item in files]
    multiquery_ret = pdf_multi_query_retriever(index=files_index)
    multiquery_retrived_docs = multiquery_ret.invoke(question)
    if len(multiquery_retrived_docs)>0:
            context=""
            msg_source_docs = multiquery_retrived_docs
            for doc in msg_source_docs:
                for key, value in doc.dict().items():
                    if key == "page_content":
                        context += value+'\n'
                    elif key == "metadata":
                        for k, v in value.items():
                            context += f"{k}:{str(v)}\n"
                context += '\n###\n\n'

    current_app.logger.debug('Context: %s', context)
    answer = ""
    token_count = 1
    ttft= ""
    for chunk in get_pdf_llm_chain(session_id).stream({"question": question, "context": context}):
# for chunk in get_agent(INDEX_CHAT_HISTORY, session_id).run(question):   
        current_app.logger.debug('Stream: %s', chunk)
        token={"token":chunk}
        yield f"data: {json.dumps(token)}\n\n"
        answer += chunk
        if token_count <= 2:
            if token_count == 2:
                ttft = round((time.time() - start_time)/60,2)
            token_count += 1
    ttf = round((time.time() - start_time)/60,2)
    yield f'data: {MSG_STATS_TAG} {json.dumps({"ttf":ttf, "ttft":ttft})}\n\n'
    doc_sources=[]
    for doc in msg_source_docs:
        doc_source = {**doc.metadata, 'page_content': doc.page_content}
        doc_sources.append(doc_source)
    yield f'data: {MSG_SOURCE_TAG} {json.dumps({"msg_sources":doc_sources})}\n\n'

    current_app.logger.debug('Answer: %s', answer)
    chat_history.add_user_message(question)
    chat_history.add_ai_message(answer)
    yield f"data: {CHAT_DONE_TAG}\n\n"
    
    yield f"data: {DONE_TAG}\n\n"