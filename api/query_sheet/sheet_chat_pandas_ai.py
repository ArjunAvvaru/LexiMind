from pandasai import SmartDataframe, SmartDatalake
import pandas as pd
import pandasai
from pandasai.llm import OpenAI
from flask import render_template, stream_with_context, current_app
from elasticsearch_client import get_elasticsearch_chat_message_history
from langchain_experimental.agents.agent_toolkits import create_pandas_dataframe_agent
from llm_integrations import get_llm
from value_map import INDEX_CHAT_HISTORY, MSG_SOURCE_TAG, DONE_TAG, CHAT_DONE_TAG, UPLOAD_PATH, EXPORT_PATH, MSG_STATS_TAG
from pandasai.llm import HuggingFaceTextGen
import os
import json
import matplotlib.pyplot as plt
import matplotlib
import mpld3
from tabulate import tabulate
import time
import numpy as np

@stream_with_context
def sheet_ask_question_pandas_ai(question, session_id, files, start_time=time.time()):
    if not files:
        token = {"token":"Please upload a csv/xls/xlsx file to continue."}
        yield f"data: {json.dumps(token)}\n\n"
        yield f"data: {CHAT_DONE_TAG}\n\n"
        yield f"data: {DONE_TAG}\n\n"
        return
    if not all(file.lower().endswith(('.csv', '.xlsx', '.xls')) for file in files):
        token = {"token":"Please upload all files in csv/xls/xlsx format to continue."}
        yield f"data: {json.dumps(token)}\n\n"
        yield f"data: {CHAT_DONE_TAG}\n\n"
        yield f"data: {DONE_TAG}\n\n"
        return
    
    chat_history = get_elasticsearch_chat_message_history(
        INDEX_CHAT_HISTORY, session_id
    )


    dfs=[]
    for file in files:
        if file.lower().endswith('.csv'):
            df = pd.read_csv(os.path.join(UPLOAD_PATH, file))
        elif file.lower().endswith(('.xls', '.xlsx')):
            df = pd.read_excel(os.path.join(UPLOAD_PATH, file))
        df = df.applymap(lambda s: s.lower() if type(s) == str else s)
        dfs.append(df)
    

    llm=OpenAI(api_token=os.getenv("OPENAI_API_KEY"))
    llm.model="gpt-3.5-turbo"

    save_charts_path = os.path.abspath(EXPORT_PATH)
    pandas_ai = SmartDatalake(dfs=dfs, config={"llm": llm, "save_charts": True, "open_charts": False, "save_charts_path": EXPORT_PATH,"enable_cache":False, "enable_privacy":False})

    answer = ""
    
    response = pandas_ai.chat(question.lower())
    current_app.logger.debug('Stream: %s', response)
    file_id=""
    
    if isinstance(response, np.int64):
        response = int(response)
    elif isinstance(response, np.float64):
        response = float(response)
    elif isinstance(response, SmartDataframe):
        response = tabulate(response.dataframe, headers='keys', tablefmt='pipe')  # assuming SmartDataframe has a df attribute that is a pandas DataFrame
    elif isinstance(response, pd.DataFrame):
        response = tabulate(response, headers='keys', tablefmt='pipe')
    elif isinstance(response, str) and os.path.exists(response):
        file_id = response.split('exports/',1)[-1]
        response= response.split('data/',1)[-1]
        response = f'![Chart]({response})'


    token={"token":response}
    yield f"data: {json.dumps(token)}\n\n"
    ttft = round((time.time() - start_time)/60,2)
    ttf = round((time.time() - start_time)/60,2)
    yield f'data: {MSG_STATS_TAG} {json.dumps({"ttf":ttf, "ttft":ttft})}\n\n'
    answer = response
    if file_id !="":
        answer = file_id 
    current_app.logger.debug('Answer: %s', answer)
    chat_history.add_user_message(question)
    chat_history.add_ai_message(answer)
    yield f"data: {CHAT_DONE_TAG}\n\n"
    
    yield f"data: {DONE_TAG}\n\n"