export class User {
    email: string;
    usuario: string;
    dataNasc: Date;
    senha: string;
    pathFotoPerfil?: string;
    biografia?: string;
    seguidores?: string[];
    seguindo?: string[];
    posts?: Postagem[];
    criadoEm?: Date;
}

export class Postagem {
    usuario: string;
    pathFotoPost: string;
    descricaoPost: string;
    comentarios?: Comentario[];
    tags?: string[];
    curtidas?: string[];
    criadoEm?: Date;
    atualizadoEm?: Date;
}

export class Comentario {
    usuario: string;
    comentarioTexto: string;
    criadoEm?: Date;
    atualizadoEm?: Date;
}