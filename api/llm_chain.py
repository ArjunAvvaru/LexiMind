from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables import RunnableLambda, RunnablePassthrough
from langchain.schema import StrOutputParser
from llm_integrations import get_llm
from elasticsearch_client import get_elasticsearch_chat_message_history
from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory
from operator import itemgetter
from value_map import llm_chain_prompt, llm_chain_instructions
import os

def get_llm_chain(session_id):
    llm=get_llm()
    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                llm_chain_prompt,
            ),
            ("system", llm_chain_instructions),
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
    chain = (RunnablePassthrough.assign(history=RunnableLambda(memory.load_memory_variables) | itemgetter("history")) | prompt | llm | StrOutputParser())
    return chain