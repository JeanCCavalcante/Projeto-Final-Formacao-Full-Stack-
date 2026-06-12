from pymongo import MongoClient
from dotenv import load_dotenv
import os
from pathlib import Path

def connect_to_mongo():
    pasta_atual = Path(__file__).resolve().parent
    caminhino_env = pasta_atual.parent.parent / "backend" / ".env"
    if not caminhino_env.exists():
        print("Ops! O arquivo .env não foi encontrado. Verifique se ele está no caminho correto:", caminhino_env)
        return None, None

    load_dotenv(dotenv_path=caminhino_env)
    chave_mongo = os.getenv("MONGO_URI")
    if not chave_mongo:
        print("Ops! A variável de ambiente MONGO_URI não foi encontrada.")
        return None, None

    client = MongoClient(chave_mongo)
    db = client["taskinsight"]
    collection_users = db["users"]
    collection_tasks = db["tasks"]
    print("Conexão estabelecida com sucesso!")
    print("a chave do armário é:", chave_mongo)
    return collection_users, collection_tasks

if __name__ == "__main__":
    collection_users, collection_tasks = connect_to_mongo()
    if collection_users is not None and collection_tasks is not None:
        print("Coleção de usuários:", collection_users)
        print("Coleção de tarefas:", collection_tasks)
        total_usuarios = collection_users.count_documents({})
        print(f"Temos {total_usuarios} usuários cadastrados na coleção 'users'.")
        total_tarefas = collection_tasks.count_documents({})
        print(f"Temos {total_tarefas} tarefas cadastradas na coleção 'tasks'.")
