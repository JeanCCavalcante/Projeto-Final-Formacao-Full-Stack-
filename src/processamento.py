import pandas as pd
import os

def processar_dados():
    print("Lendo dados da pasta RAW...")
    
    # Definindo o caminho do arquivo
    caminho_entrada = "data/raw/vendas.csv"
    caminho_saida = "data/processed/vendas_com_imposto.csv"

    # Verificando se o arquivo existe antes de ler
    if os.path.exists(caminho_entrada):
        # O Pandas lê o CSV e transforma em um "DataFrame" (uma tabela inteligente)
        df = pd.read_csv(caminho_entrada)
        
        # Transformação: Criando uma nova coluna de 'imposto' (10% do valor)
        df['imposto'] = df['valor'] * 0.1
        
        print("Tabela processada com sucesso:")
        print(df)

        # Salvando o resultado na pasta PROCESSED
        df.to_csv(caminho_saida, index=False)
        print(f"\nArquivo salvo em: {caminho_saida}")
    else:
        print("Erro: Arquivo vendas.csv não encontrado!")

if __name__ == "__main__":
    processar_dados()