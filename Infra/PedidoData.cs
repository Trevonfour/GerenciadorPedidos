using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using GerenciadorDePedidos.Models;
using Microsoft.Data.SqlClient;

namespace GerenciadorDePedidos.Infra
{
    public class PedidoData
    {
        private readonly string _connectionString;

        public PedidoData(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        

        public IEnumerable<dynamic> ObterTodosPedidos()
        {
            string query = "EXEC CONSULTAR_TODOS_PEDIDOS;";

            using (IDbConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                var result = connection.Query(query);
                return result;

            }
        }

        public IEnumerable<dynamic> ObterTodosPedidosUsuario(int cd_usuario)
        {
            string query = "EXEC CONSULTAR_TODOS_PEDIDOS_USUARIO @Id;";

            using (IDbConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                var result = connection.Query(query, new { Id = cd_usuario });
                return result;
            }
        }

        public IEnumerable<dynamic> ConsultarDetalhesPedido(int numeroPedido)
        {
            string query = "EXEC CONSULTAR_DETALHE_PEDIDO @NUMERO_PEDIDO;";

            using (IDbConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                var result = connection.Query(query, new { NUMERO_PEDIDO = numeroPedido });
                return result;
            }
        }

        public void AdicionarPedido(int cd_usuario, PedidoModel pedido)
        {

            string query = "EXEC INSERIR_PEDIDO @NUMERO_PEDIDO, @CD_USUARIO, @CD_PRODUTO, @VALOR_TOTAL;";

            using (IDbConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                for (int i = 0; i < pedido.Produtos.Count; i++)
                {
                    var parametros = new
                    {
                        NUMERO_PEDIDO = pedido.NumeroPedido,
                        CD_USUARIO = cd_usuario,
                        CD_PRODUTO = pedido.Produtos[i].Id,
                        VALOR_TOTAL = pedido.ValorTotal
                    };
                    connection.Query(query, parametros);
                }
            }
        }
        
        public bool ValidarPedidoExistente(string numeroPedido)
        {
            string query = "SELECT * FROM PEDIDOS WHERE NUMERO_PEDIDO = @NUMERO_PEDIDO;";

            using (IDbConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                var result = connection.Query(query, new { NUMERO_PEDIDO = numeroPedido });
                bool existe = result.Count() > 0 ? true : false;
                return existe; 
            }
        }
    }
}