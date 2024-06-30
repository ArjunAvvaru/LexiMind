from langchain_elasticsearch import ElasticsearchStore
from elasticsearch_client import elasticsearch_client
from elasticsearch_client import elasticsearch_client
import os

ELSER_MODEL = os.getenv("ELSER_MODEL", ".elser_model_2")
    
def pdf_retriever(index):
    store = ElasticsearchStore(
      es_connection=elasticsearch_client,
      index_name=index,
      strategy=ElasticsearchStore.SparseVectorRetrievalStrategy(model_id=ELSER_MODEL),
    )


    return store.as_retriever(search_kwargs={'k': 1, 'fetch_k': 10})