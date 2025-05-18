using GerenciadorDePedidos.Entities;
using Microsoft.Data.SqlClient;
using Dapper;
using System.Data;

namespace GerenciadorDePedidos.Infra
{
    public class UsuarioData
    {
        private readonly string _connectionString;

        public UsuarioData(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }


        public Usuario RetornarUsuario(string nomeUsuario, string senha)
        {
            string query = "EXEC RETORNAR_USUARIO @NOME_USUARIO, @SENHA";

            using (IDbConnection connection = new SqlConnection(_connectionString))
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
