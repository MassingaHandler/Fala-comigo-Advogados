# Fala Comigo (Versão Python)

Esta é a versão Python da aplicação "Fala Comigo", convertida utilizando o framework **Streamlit**.

A aplicação mantém todas as funcionalidades do protótipo original:
1.  **Assistente de Consulta**: Seleção de temas e pacotes.
2.  **Simulação de Pagamento M-Pesa**: Loading states e transição.
3.  **Atribuição Inteligente**: Seleção de advogado baseada no tema.
4.  **Chat em Tempo Real**: Interface de chat persistente durante a sessão.

## Como Executar

1.  Certifique-se de que tem Python instalado (3.8+).
2.  Instale as dependências:
    ```bash
    pip install -r requirements.txt
    ```
3.  Execute a aplicação:
    ```bash
    streamlit run app.py
    ```

## Estrutura do Projeto

*   `app.py`: Código fonte principal contendo toda a lógica e UI.
*   `requirements.txt`: Lista de bibliotecas necessárias.
