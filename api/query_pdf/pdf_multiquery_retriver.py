from langchain.retrievers.multi_query import MultiQueryRetriever
from llm_integrations import get_llm
from query_pdf.pdf_retriever import pdf_retriever

import logging

logging.basicConfig()
logging.getLogger("langchain.retrievers.multi_query").setLevel(logging.INFO)

def pdf_multi_query_retriever(index):
    llm=get_llm()
    llm.streaming=False
    retriever = MultiQueryRetriever.from_llm(
        retriever= pdf_retriever(index),
        llm=llm,
    )
    return retriever