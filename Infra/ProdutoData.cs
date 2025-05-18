using GerenciadorDePedidos.Entities;
using Microsoft.Data.SqlClient;
using Dapper;
using System.Data;

namespace GerenciadorDePedidos.Infra
{
    public class ProdutoData
    {
        private readonly string connectionString = "Server=localhost\\SQLEXPRESS;Database=GERENCIADOR_DE_PEDIDOS;Trusted_Connection=True;TrustServerCertificate=True;";

        public IEnumerable<dynamic> ObterTodosProdutos()
        {
            string query = "EXEC CONSULTAR_TODOS_PRODUTOS;";

            using (IDbConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                var result = connection.Query(query);
                return result;

            }
        }

        public void InserirNovoProduto(Produto produto)
        {
            string query = "EXEC INSERIR_PRODUTO @NOME, @DESCRICAO, @PRECO;";

            using (IDbConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                var parametros = new
                {
                    NOME = produto.Nome,
                    DESCRICAO = produto.Descricao,
                    PRECO = produto.Preco
                };
                connection.Query(query, parametros);
            }
        }

        public IEnumerable<dynamic> ObterProdutoPorId(int produtoId)
        {
            string query = "EXEC CONSULTAR_PRODUTO_ID @CD_PRODUTO;";

            using (IDbConnection connection = new SqlConnection(connectionString))
            {
                var parametro = new
                {
                    CD_PRODUTO = produtoId
                };
                var result = connection.Query(query, parametro);
                return result;
            }
        }
        public void AtualizarDadosProduto(Produto produto)
        {
            string query = "EXEC ATUALIZAR_DADOS_PRODUTO @CD_PRODUTO, @NOME, @DESCRICAO, @PRECO;";

            using (IDbConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                var parametros = new
                {
                    CD_PRODUTO = produto.ProdutoId,
                    NOME = produto.Nome,
                    DESCRICAO = produto.Descricao,
                    PRECO = produto.Preco
                };
                connection.Query(query, parametros);
            }
        }
        public void ExluirProdutoPorId(int produtoId)
        {
            string query = "EXEC EXCLUIR_PRODUTO_ID @CD_PRODUTO;";

            using (IDbConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                var parametro = new
                {
                    CD_PRODUTO = produtoId
                };
                connection.Query(query, parametro);
            }
        }

        public bool ValidarProdutoPedido(int produtoId)
        {
            string query = "EXEC VALIDAR_PRODUTO_PEDIDO @CD_PRODUTO;";

            using (IDbConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                var parametro = new
                {
                    CD_PRODUTO = produtoId
                };
                var result = connection.Query(query, parametro);

                var existe = result.Count() > 0 ? true : false;
                return existe;

            }
        }


    }
}