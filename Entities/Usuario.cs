namespace GerenciadorDePedidos.Entities
{
    public class Usuario
    {
        public int Cd_Usuario { get; set; }
        public string Nome { get; set; }
        public string Nome_Usuario { get; set; }
        public string Senha { get; set; }
        public AdminStatus Administrador { get; set; }

    }
    public enum AdminStatus
    {
        False = 0,
        True = 1
    }
}
