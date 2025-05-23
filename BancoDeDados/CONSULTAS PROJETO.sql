
--CRIACAO BANCO DE DADOS
CREATE DATABASE GERENCIADOR_DE_PEDIDOS

--CRIACAO TABELAS

CREATE TABLE USUARIOS(
    CD_USUARIO INT NOT NULL PRIMARY KEY IDENTITY,
    NOME VARCHAR(150) NOT NULL,
    NOME_USUARIO VARCHAR(100) NOT NULL,
    SENHA VARCHAR(128) NOT NULL,
	ADMINISTRADOR BIT NOT NULL DEFAULT 0
)

CREATE TABLE PRODUTOS(
    CD_PRODUTO INT NOT NULL PRIMARY KEY IDENTITY,
    NOME VARCHAR(150) NOT NULL,
    DESCRICAO VARCHAR(255),
    PRECO DECIMAL(18, 2) NOT NULL;
)


CREATE TABLE PEDIDOS(
    NUMERO_PEDIDO VARCHAR(9) NOT NULL,
	CD_USUARIO INT NOT NULL,
	CD_PRODUTO INT NOT NULL,
	VALOR_TOTAL DECIMAL(18, 2) NOT NULL,
	DH_CRIACAO DATETIME NOT NULL DEFAULT GETDATE(),
	FOREIGN KEY (CD_USUARIO) REFERENCES USUARIOS(CD_USUARIO),
	FOREIGN KEY (CD_PRODUTO) REFERENCES PRODUTOS(CD_PRODUTO)
)




-- CRIACAO PROCEDURES RELACIONADAS A USUARIO

CREATE PROCEDURE RETORNAR_USUARIO
    @NOME_USUARIO VARCHAR(100),
    @SENHA VARCHAR(128)
AS
BEGIN
    SELECT * FROM USUARIOS WHERE NOME_USUARIO =  @NOME_USUARIO AND SENHA = @SENHA
END;

-- CRIACAO PROCEDURES RELACIONADAS A PRODUTOS

CREATE PROCEDURE CONSULTAR_TODOS_PRODUTOS
AS
BEGIN
    SELECT * FROM PRODUTOS
END;

exec CONSULTAR_TODOS_PRODUTOS

CREATE PROCEDURE INSERIR_PRODUTO
	@NOME VARCHAR(150),
	@DESCRICAO VARCHAR(255),
	@PRECO DECIMAL
AS
BEGIN
    INSERT PRODUTOS(NOME,DESCRICAO, PRECO)
	VALUES(@NOME,@DESCRICAO, @PRECO)
END;

CREATE PROCEDURE CONSULTAR_PRODUTO_ID
	@CD_PRODUTO INT
AS
BEGIN
    SELECT * FROM  PRODUTOS WHERE CD_PRODUTO = @CD_PRODUTO
END;



CREATE PROCEDURE ATUALIZAR_DADOS_PRODUTO
	@CD_PRODUTO INT,
	@NOME VARCHAR(150),
	@DESCRICAO VARCHAR(255),
	@PRECO DECIMAL(18,2)
AS
BEGIN
    UPDATE 
	PRODUTOS
	SET 
	NOME = @NOME,
	DESCRICAO = @DESCRICAO,
	PRECO = @PRECO
	WHERE
	CD_PRODUTO = @CD_PRODUTO
END;

EXEC ATUALIZAR_DADOS_PRODUTO 17, 'CAQUI', 'FRUTA', 10.50


CREATE PROCEDURE EXCLUIR_PRODUTO_ID
	@CD_PRODUTO INT
AS
BEGIN
    DELETE PRODUTOS 
	WHERE CD_PRODUTO = @CD_PRODUTO
END;

SELECT * FROM PRODUTOS

CREATE PROCEDURE VALIDAR_PRODUTO_PEDIDO
	@CD_PRODUTO INT
AS
BEGIN
    SELECT CD_PRODUTO
	FROM PEDIDOS
	WHERE CD_PRODUTO = @CD_PRODUTO
END;

SELECT * FROM PRODUTOS 


--PROCEDURES RELACIONADAS A PEDIDO

CREATE PROCEDURE INSERIR_PEDIDO
	@NUMERO_PEDIDO VARCHAR(9),
	@CD_USUARIO INT,
	@CD_PRODUTO INT,
	@VALOR_TOTAL DECIMAL(18,2)
AS
BEGIN
    INSERT PEDIDOS(NUMERO_PEDIDO, CD_USUARIO, CD_PRODUTO, VALOR_TOTAL)
	VALUES(@NUMERO_PEDIDO, @CD_USUARIO, @CD_PRODUTO, @VALOR_TOTAL)
END;




CREATE PROCEDURE CONSULTAR_TODOS_PEDIDOS_USUARIO
	@CD_USUARIO INT
AS
BEGIN
    WITH PedidosUnicos AS (
		SELECT 
			P.NUMERO_PEDIDO, 
			U.NOME, 
			P.VALOR_TOTAL, 
			P.DH_CRIACAO,
			ROW_NUMBER() OVER (PARTITION BY P.NUMERO_PEDIDO ORDER BY P.DH_CRIACAO ASC) AS RN
		FROM PEDIDOS P  
		INNER JOIN USUARIOS U ON P.CD_USUARIO = U.CD_USUARIO  
		WHERE P.CD_USUARIO = @CD_USUARIO  
	)
	SELECT NUMERO_PEDIDO, NOME, VALOR_TOTAL, DH_CRIACAO  
	FROM PedidosUnicos  
	WHERE RN = 1
	ORDER BY DH_CRIACAO DESC
END;

CREATE PROCEDURE CONSULTAR_TODOS_PEDIDOS
AS
BEGIN
    WITH PedidosUnicos AS (
		SELECT 
			P.NUMERO_PEDIDO, 
			U.NOME, 
			P.VALOR_TOTAL, 
			P.DH_CRIACAO,
			ROW_NUMBER() OVER (PARTITION BY P.NUMERO_PEDIDO ORDER BY P.DH_CRIACAO ASC) AS RN
		FROM PEDIDOS P  
		INNER JOIN USUARIOS U ON P.CD_USUARIO = U.CD_USUARIO
	)
	SELECT NUMERO_PEDIDO, NOME, VALOR_TOTAL, DH_CRIACAO  
	FROM PedidosUnicos  
	WHERE RN = 1
	ORDER BY DH_CRIACAO DESC
END;
EXEC CONSULTAR_DETALHE_PEDIDO 328379874

CREATE PROCEDURE CONSULTAR_DETALHE_PEDIDO
	@NUMERO_PEDIDO INT
AS
BEGIN
    SELECT NUMERO_PEDIDO, U.NOME, PR.NOME PRODUTO, PRECO, PE.VALOR_TOTAL, PE.DH_CRIACAO 
	FROM 
	PEDIDOS PE
	INNER JOIN USUARIOS U ON  PE.CD_USUARIO = U.CD_USUARIO
	INNER JOIN PRODUTOS PR ON  PE.CD_PRODUTO = PR.CD_PRODUTO
	WHERE NUMERO_PEDIDO = @NUMERO_PEDIDO
END;



--CRIAC�O EXEMPLOS

INSERT USUARIOS(NOME, NOME_USUARIO, SENHA, ADMINISTRADOR)
VALUES ('Alexandre Silva', 'ale', '123', 0);

INSERT USUARIOS(NOME, NOME_USUARIO, SENHA, ADMINISTRADOR)
VALUES ('UsuarioComum', 'noadmin', 'noadmin', 0);

INSERT PRODUTOS(NOME, DESCRICAO, PRECO)
VALUES ('CENOURA', 'VEGETAL', 18.20);

INSERT PRODUTOS(NOME, DESCRICAO, PRECO)
VALUES ('BETERRABA', 'VEGETAL', 15);

INSERT PRODUTOS(NOME, DESCRICAO, PRECO)
VALUES ('KWID', 'CARRO', 20.50);

INSERT PEDIDOS(NUMERO_PEDIDO, CD_USUARIO, CD_PRODUTO, VALOR_TOTAL)
VALUES (100000000, 2 , 1, 53.70);

INSERT PEDIDOS(NUMERO_PEDIDO, CD_USUARIO, CD_PRODUTO, VALOR_TOTAL)
VALUES (100000002, 2 , 3, 20.50);

INSERT PEDIDOS(NUMERO_PEDIDO, CD_USUARIO, CD_PRODUTO, VALOR_TOTAL)
VALUES (100000000, 2 , 3, 53.70);

INSERT PEDIDOS(NUMERO_PEDIDO, CD_USUARIO, CD_PRODUTO, VALOR_TOTAL)
VALUES (100500000, 4 , 4, 71);
INSERT PEDIDOS(NUMERO_PEDIDO, CD_USUARIO, CD_PRODUTO, VALOR_TOTAL)
VALUES (100500000,  4, 4, 71);
INSERT PEDIDOS(NUMERO_PEDIDO, CD_USUARIO, CD_PRODUTO, VALOR_TOTAL)
VALUES (100500000,  4, 2, 71);
INSERT PEDIDOS(NUMERO_PEDIDO, CD_USUARIO, CD_PRODUTO, VALOR_TOTAL)
VALUES (100500000,  4, 2, 71);
