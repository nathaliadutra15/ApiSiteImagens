import mongoose from "mongoose";

const Schema = mongoose.Schema;

const perfilUsuario = new Schema({
    email: String,
    usuario: String,
    dataNasc: Date,
    senha: String,
    pathFotoPerfil: String,
    biografia: String,
    seguidores: [],
    seguindo: [],
    posts: [{
        pathFotoPost: String,
        descricaoPost: String,
        comentarios: [{
            usuario: String,
            comentarioTexto: String,
            criadoEm: Date,
            atualizadoEm: Date
        }],
        tags: [],
        curtidas: [],
        criadoEm: Date,
        atualizadoEm: Date
    }],
    criadoEm: Date
});


module.exports = mongoose.model("Usuarios", perfilUsuario);