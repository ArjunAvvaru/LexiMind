import os

INDEX_CHAT_HISTORY = os.getenv(
    "ES_INDEX_CHAT_HISTORY", "workplace-app-docs-chat-history"
)

SESSION_ID_TAG = "[SESSION_ID]"
SOURCE_TAG = "[SOURCE]"
MSG_SOURCE_TAG = "[MSG_SOURCE]"
DONE_TAG = "[DONE]"
SEARCH_DONE_TAG = "[SEARCH_DONE]"
CHAT_DONE_TAG = "[CHAT_DONE]"
TOTAL_TAG = "[TOTAL]"
FACET_TAG = "[FACET]"
MSG_STATS_TAG = "[MSG_STATS]"
FILEID_TAG = "[FILE_ID]"

UPLOAD_PATH="data\\uploads"
EXPORT_PATH="data/exports"
# EXPORT_PATH="data/uploads/exports"


filetype_map = {
    "pdf" : "pdf",
    "docx" : "word",
    "pptx" : "powerpoint",
    "xlsx" : "excel",
    "doc" : "word",
    "ppt" : "powerpoint",
    "xls" : "excel",
    "txt" : "docs",
    "jpg" : "image",
    "jpeg" : "image",
    "png" : "image",
    "msg" : "outlook",
    "eml" : "outlook",
}

llm_chain_prompt = "You are an Artificial intelligence chatbot helping to answer a human. Answer the QUESTION using the provided CONTEXT which might be related to the QUESTION and think thorougly to answer at one go. I'm going to tip you $600 for a faster and precise answer. You will be penalized $100 for every bad answer."

llm_chain_instructions="""
             You must strictly follow the following principles:
             - Always answer in MARKDOWN FORMAT. You will be penalized if you do not answer with markdown when it would be possible.
             - Always provide a unique answer, do not repeat yourself.
             - Be polite and respectful.
             - Always directly start answering the question without mentioning your role and stick to it without deviations.
             - Response must have only answer, question should be omitted .
             - Do not ask for more clarification/information/context/details/examples.
             - Response should be precise with no Human conversations.
             - Answer the question in pretty looking readable format by human.
             - If you are not able to answer the QUESTION from below CONTEXT, strictly say that you don't know, don't try to make up an answer.
             - At the end of Response always return all sources to your answer as a consolidated list, with clickable links using [TITLE](URL) format.
             """