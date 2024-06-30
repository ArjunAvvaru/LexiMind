from flask import render_template, stream_with_context, current_app
import pandas as pd
import os
from value_map import UPLOAD_PATH

@stream_with_context
def load_csv_xlsx_xls(file, title, session_id, id):
    file.save(os.path.join(UPLOAD_PATH, id))

    yield f"data: [PROGRESS] 1\n\n"
    yield f"data: {id}\n\n"

    
    # # Load the file into a pandas DataFrame
    # if extension == ".csv":
    #     df = pd.read_csv(file)
    # elif extension in [".xlsx", ".xls"]:
    #     df = pd.read_excel(file)
    
    # # Process the DataFrame as needed...
    
    # # For example, you might yield each row of the DataFrame
    # for index, row in df.iterrows():
    #     yield f"data: {row.to_dict()}\n\n"