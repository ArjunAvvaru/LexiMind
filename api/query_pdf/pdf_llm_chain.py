from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables import RunnableLambda, RunnablePassthrough
from langchain.schema import StrOutputParser
from llm_integrations import get_llm
from elasticsearch_client import get_elasticsearch_chat_message_history
from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory
from operator import itemgetter
import os

def get_pdf_llm_chain(session_id):
    llm=get_llm()
    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "You are an Artificial intelligence chatbot helping to answer a human. Your are asked a question on a PDF that is uploaded by the human. Answer the QUESTION using the provided CONTEXT that are related to the question from PDF. I'm going to tip you $600 for a faster and precise answer. You will be penalized $100 for every bad answer.",
            ),
            ("system", """
             You must strictly follow the following principles:
             - Always answer in MARKDOWN FORMAT. You will be penalized if you do not answer with markdown when it would be possible.
             - Be polite and respectful.
             - Always directly start answering the question without mentioning your role and stick to it without deviations.
             - Response must have only answer, question should be omitted .
             - Do not ask for more clarification/information/context/details/examples.
             - Response should be precise with no Human conversations.
             - Answer the question in pretty looking readable format by human.
             - If you are not able to answer the QUESTION from below CONTEXT, strictly say that you don't know, don't try to make up an answer.
             - At the end of Response always return all sources to your answer as a consolidated list, with the file title and page number from context.
             """),
            ("human", "QUESTION:{question}"),
            ("human", "CONTEXT:{context}"),
            MessagesPlaceholder(variable_name="history"),
            ("human", "AI Response:"),
        ]
    )
    INDEX_CHAT_HISTORY = os.getenv("ES_INDEX_CHAT_HISTORY", "workplace-app-docs-chat-history")
    chat_history = get_elasticsearch_chat_message_history(INDEX_CHAT_HISTORY, session_id)
    memory=ConversationBufferMemory(chat_memory=chat_history, return_messages=True)
    memory.load_memory_variables({})
    {'history': []}
    chain = (RunnablePassthrough.assign(history=RunnableLambda(memory.load_memory_variables) | 
             itemgetter("history")) | 
             prompt | 
             llm | 
             StrOutputParser())
    return chain