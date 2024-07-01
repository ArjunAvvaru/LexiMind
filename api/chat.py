from llm_integrations import get_llm
from langchain_elasticsearch import ElasticsearchStore
from elasticsearch_client import (elasticsearch_client, get_elasticsearch_chat_message_history)
from multiquery_retriever import multi_query_retriever
from llm_chain import get_llm_chain
from flask import render_template, stream_with_context, current_app
from value_map import INDEX_CHAT_HISTORY, DONE_TAG, CHAT_DONE_TAG, SEARCH_DONE_TAG, TOTAL_TAG, FACET_TAG, SOURCE_TAG, SESSION_ID_TAG, MSG_SOURCE_TAG, MSG_STATS_TAG
import json
import time
import os

INDEX = os.getenv("ES_INDEX", "workplace-app-docs")
INDEX_CHAT_HISTORY = os.getenv(
    "ES_INDEX_CHAT_HISTORY", "workplace-app-docs-chat-history"
)
ELSER_MODEL = os.getenv("ELSER_MODEL", ".elser_model_2")
SESSION_ID_TAG = "[SESSION_ID]"
SOURCE_TAG = "[SOURCE]"
DONE_TAG = "[DONE]"

store = ElasticsearchStore(
    es_connection=elasticsearch_client,
    index_name=INDEX,
    strategy=ElasticsearchStore.SparseVectorRetrievalStrategy(model_id=ELSER_MODEL),
)


@stream_with_context
def ask_question(question, session_id, action, llm_model, semantic_enable, results_size, results_page, filters, start_time=time.time()):

    yield f"data: {SESSION_ID_TAG} {session_id}\n\n"
    current_app.logger.debug("Chat session ID: %s", session_id)

    chat_history = get_elasticsearch_chat_message_history(
        INDEX_CHAT_HISTORY, session_id
    )

    if action != "search" and len(chat_history.messages) > 0:
        # create a condensed question
        condense_question_prompt = render_template(
            'condense_question_prompt.txt', question=question,
            chat_history=chat_history.messages)
        llm= get_llm()
        llm.streaming = False
        question = llm.invoke(condense_question_prompt).content
         
    if action == "chat":
            results_page = 0
            results_size = 20

    current_app.logger.debug('Question: %s', question)
    docs = store.as_retriever( search_kwargs={'k': 20, 'fetch_k': 500}).invoke(question)
    if action !="chat":
        yield f"data: {TOTAL_TAG} {20}\n\n"
        yield f'data: {FACET_TAG} {json.dumps({})}\n\n'
        for doc in docs:
            doc_source = {**doc.metadata, 'page_content': doc.page_content}
            current_app.logger.debug('Retrieved document passage from: %s', doc.metadata['Title'])
            yield f'data: {SOURCE_TAG} {json.dumps(doc_source)}\n\n'
        yield f"data: {SEARCH_DONE_TAG}\n\n"


    if action != "search":
        answer = ''
        multiquery_ret = multi_query_retriever(store=store)
        multiquery_retrived_docs = multiquery_ret.invoke(question)
        ttft= ""
        if len(multiquery_retrived_docs)>0:
            context=""
            msg_source_docs = docs[:5]
            for doc in msg_source_docs:
                for key, value in doc.dict().items():
                    if key == "page_content":
                        context += 'Matching Part of the Plot:'+value+'\n'
                    elif key == "metadata":
                        for k, v in value.items():
                            context += f"{k}:{str(v)}\n"
                context += '\n###\n\n'
            
            current_app.logger.debug('Context: %s', context)  
            
            token_count = 1
            for chunk in get_llm_chain(session_id).stream({"question": question, "context": context}):
                current_app.logger.debug('Stream: %s', chunk)
                token={"token":chunk}
                yield f"data: {json.dumps(token)}\n\n"
                answer += chunk
                # Check if this is the first chunk
                if token_count <= 2:
                    if token_count == 2:
                        ttft = round((time.time() - start_time)/60,2)
                    token_count += 1
        else:
            chunk="I am sorry, I could not find any relevant context to answer your question. Please try another question."
            current_app.logger.debug('Stream: %s', chunk)
            token={"token":chunk}
            yield f"data: {json.dumps(token)}\n\n"
            answer += chunk
            ttft = round((time.time() - start_time)/60,2)

        
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