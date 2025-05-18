using GerenciadorDePedidos.Entities;
using Microsoft.Data.SqlClient;
using Dapper;
using System.Data;

namespace GerenciadorDePedidos.Infra
{
    public class UsuarioData
    {
        private readonly string connectionString = "Server=localhost\\SQLEXPRESS;Database=GERENCIADOR_DE_PEDIDOS;Trusted_Connection=True;TrustServerCertificate=True;";


        public Usuario RetornarUsuario(string nomeUsuario, string senha)
        {
            string query = "EXEC RETORNAR_USUARIO @NOME_USUARIO, @SENHA";

            using (IDbConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                var parametros = new
                {
                    NOME_USUARIO = nomeUsuario,
                    SENHA = senha,
                };
                var usuario = connection.Query<Usuario>(query, parametros).FirstOrDefault();
                return usuario;
            }
        }
    }
}
