# LexiMind

In today’s data-driven landscape, information is the new gold. Yet, shifting through mountains of data can be an arduous task. Enter LexiMind, a cutting-edge Retrieval Augmented Generative (RAG) AI-powered solution that transforms the way we interact with data.

🚀 What Is LexiMind?

LexiMind seamlessly integrates three powerful components:
Search Engine: Built on ElasticSearch, LexiMind rapidly retrieves relevant information from vast datasets using vector-based techniques.
Conversational Companion: Imagine having a dialogue with your data. LexiMind allows you to converse, query, and explore insights directly within the platform.
Document and Sheet Integration: Upload PDFs or spreadsheets, and LexiMind turns them into dynamic conversations.

![LexiMind Demo](./demo/LexiMind%20Demo.gif)

🌟 Key Features:

Semantic Search: Beyond simple keywords, LexiMind understands context and intent. It’s like having a data-savvy colleague who anticipates your needs.
PPT Generation: Transform conversations into polished presentations effortlessly. Share insights with stakeholders in a professional format.

Conversational Exploration:
PDF Conversations: Upload research papers, reports, or manuals. LexiMind extracts key points and allows you to discuss findings collaboratively.
Sheet Conversations: Dive into spreadsheet data. Ask questions, analyze trends, and gain deeper insights—all within LexiMind.

Customizable Algorithms:
Multiquery retrieval (already implemented) can be extended to a cross encoder for even better results.
Explore alternatives like graph-based algorithms, Named Entity Recognition (NER), or agent-based tools.
Efficient Data Retrieval:
Nested passages enhance retrieval speed.
Aggregations and filters allow precise exploration.
Pagination ensures smooth navigation through results.

🌐 Privacy and Deployment:

LexiMind respects data privacy. For organizations needing in-house solutions, it’s deployable on your production-ready servers.
Whether you’re a startup, enterprise, or research institution, LexiMind adapts to your unique requirements.

🔗 Get Started:

Clone LexiMind from my GitHub repo (link below). Connect it to OpenAI APIs or Local Server made using LMStudio/Ollama or other LLM endpoints as described in the README.
Experience the future of data exploration. Let’s collaborate!

📬 Reach Out:

Feel free to connect! Let’s discuss how LexiMind can revolutionize your data workflows.

Email: arjun.avvaru1707@gmail.com
LinkedIn: [arjunavvaru](https://www.linkedin.com/in/arjunavvaru)

This is a sample app that combines Elasticsearch, Langchain and a number of different LLMs to create a chatbot experience with ELSER with your own private data.

**Requires at least 8.11.0 of Elasticsearch.**


## Clone the Project

Clone the project from Github

```bash
git clone https://github.com/ArjunAvvaru/LexiMind.git
cd LexiMind
```

## Installing and connecting to Elasticsearch

### Install Elasticsearch

There are a number of ways to install Elasticsearch. Cloud is best for most use-cases. Visit the [Install Elasticsearch](https://www.elastic.co/search-labs/tutorials/install-elasticsearch) for more information.

### Connect to Elasticsearch

This app requires the following environment variables to be set to connect to Elasticsearch hosted on Elastic Cloud:

```sh
export ELASTIC_CLOUD_ID=...
export ELASTIC_API_KEY=...
```

You can add these to a `.env` file for convenience. See the `env.example` file for a .env file template.

#### Self-Hosted Elasticsearch

You can also connect to a self-hosted Elasticsearch instance. To do so, you will need to set the following environment variables:

```sh
export ELASTICSEARCH_URL=...
```

### Change the Elasticsearch index and chat_history index

By default, the app will use the `workplace-app-docs` index and the chat history index will be `workplace-app-docs-chat-history`. If you want to change these, you can set the following environment variables:

```sh
ES_INDEX=workplace-app-docs
ES_INDEX_CHAT_HISTORY=workplace-app-docs-chat-history
```

## Connecting to LLM

We support three LLM providers: Azure, OpenAI and Bedrock.

To use one of them, you need to set the `LLM_TYPE` environment variable:

```sh
export LLM_TYPE=azure
```

### OpenAI

To use OpenAI LLM, you will need to provide the OpenAI key via `OPENAI_API_KEY` environment variable:

```sh
export LLM_TYPE=openai
export OPENAI_API_KEY=...
```

You can get your OpenAI key from the [OpenAI dashboard](https://platform.openai.com/account/api-keys).

### Azure OpenAI

If you are using Azure LLM, you will need to set the following environment variables:

```sh
export LLM_TYPE=azure
export OPENAI_VERSION=... # e.g. 2023-05-15
export OPENAI_BASE_URL=...
export OPENAI_API_KEY=...
export OPENAI_ENGINE=... # deployment name in Azure
```

### Bedrock LLM

To use Bedrock LLM you need to set the following environment variables in order to AWS.

```sh
export LLM_TYPE=bedrock
export AWS_ACCESS_KEY=...
export AWS_SECRET_KEY=...
export AWS_REGION=... # e.g. us-east-1
export AWS_MODEL_ID=... # Default is anthropic.claude-v2
```

#### AWS Config

Optionally, you can connect to AWS via the config file in `~/.aws/config` described here:
https://boto3.amazonaws.com/v1/documentation/api/latest/guide/credentials.html#configuring-credentials

```
[default]
aws_access_key_id=...
aws_secret_access_key=...
region=...
```

### Vertex AI

To use Vertex AI you need to set the following environment variables. More infos [here](https://python.langchain.com/docs/integrations/llms/google_vertex_ai_palm).

```sh
export LLM_TYPE=vertex
export VERTEX_PROJECT_ID=<gcp-project-id>
export VERTEX_REGION=<gcp-region> # Default is us-central1
export GOOGLE_APPLICATION_CREDENTIALS=<path-json-service-account>
```

## Running the App

Once you have indexed data into the Elasticsearch index, there are two ways to run the app: via Docker or locally. Docker is advised for testing & production use. Locally is advised for development.

### Through Docker

Build the Docker image and run it with the following environment variables.

```sh
docker build -f Dockerfile -t LexiMind.
```

#### Ingest data

Make sure you have a `.env` file with all your variables, then run:

```sh
docker run --rm --env-file .env LexiMind flask create-index
```

See "Ingest data" section under Running Locally for more details about the `flask create-index` command.

#### Run API and frontend

You will need to set the appropriate environment variables in your `.env` file.

```sh
docker run --rm -p 4000:4000 --env-file .env -d LexiMind
```

### Locally (for development)

With the environment variables set, you can run the following commands to start the server and frontend.

#### Pre-requisites

- Python 3.8+
- Node 14+

#### Install the dependencies

For Python we recommend using a virtual environment.

_ℹ️ Here's a good [primer](https://realpython.com/python-virtual-environments-a-primer) on virtual environments from Real Python._

```sh
# Create a virtual environment
python -m venv .venv

# Activate the virtual environment
source .venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Install Node dependencies
cd frontend && yarn && cd ..
```

#### Ingest data

You can index the sample data from the provided .json files in the `data` folder:

```sh
flask create-index
```

By default, this will index the data into the `workplace-app-docs` index. You can change this by setting the `ES_INDEX` environment variable.

##### Indexing your own data

The ingesting logic is stored in `data/index-data.py`. This is a simple script that uses Langchain to index data into Elasticsearch, using the `CSVLoader` and `RecursiveCharacterTextSplitter` to split the large documents into passages. Modify this script to index your own data.

Langchain offers many different ways to index data, if you cant just load it via CSVLoader. See the [Langchain documentation](https://python.langchain.com/docs/modules/data_connection/document_loaders)

Remember to keep the `ES_INDEX` environment variable set to the index you want to index into and to query from.

#### Run API and frontend

```sh
# Launch API app
flask run

# In a separate terminal launch frontend app
cd frontend && yarn start
```

You can now access the frontend at http://localhost:3000. Changes are automatically reloaded.
