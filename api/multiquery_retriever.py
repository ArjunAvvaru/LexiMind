from langchain.retrievers.multi_query import MultiQueryRetriever
from llm_integrations import get_llm

import logging

logging.basicConfig()
logging.getLogger("langchain.retrievers.multi_query").setLevel(logging.INFO)

def multi_query_retriever(store):
    llm=get_llm()
    llm.streaming=False
    retriever = MultiQueryRetriever.from_llm(
        retriever= store.as_retriever(),
        llm=llm,
        include_original=True
    )
    return retriever