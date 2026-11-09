import NoteRepositories from '../repositories/note-repositories.js';
import { InvariantError, NotFoundError } from '../../../exceptions/index.js';
import response from '../../../utils/response.js';

export const createNote = async (req, res, next) => {
  const { title, body, tags } = req.validated;
  const note = await NoteRepositories.createNote({
    title,
    body,
    tags
  });

  if (!note) {
    return next(new InvariantError('Catatan gagal ditambahkan'));
  }

  return response(res, 201, 'Catatan berhasil ditambahkan', {
    noteId: typeof note === 'object' ? note.id : note,
  });
};

export const getNotes = async (req, res, next) => {
  try {
    const notes = await NoteRepositories.getNotes();

    // ✅ Bungkus array notes ke dalam objek { notes }
    return response(res, 200, 'Catatan sukses ditampilkan', { notes });
  } catch (error) {
    next(error); // Lempar error ke middleware error handling
  }
};

export const getNoteById = async (req, res, next) => {
  const { id } = req.params;
  const note = await NoteRepositories.getNoteById(id);

  if (!note) {
    return next(new NotFoundError('Catatan tidak ditemukan'));
  }

  return response(res, 200, 'Catatan sukses ditampilkan', { note });
};

export const editNoteById = async (req, res, next) => {
  const { id } = req.params;
  const {
    title,
    body,
    tags
  } = req.validated;

  await NoteRepositories.editNoteById(id, { title, body, tags });

  return response(res, 200, 'Catatan berhasil diperbarui');
};

export const deleteNoteById = async (req, res, next) => {
  const { id } = req.params;
  const deletedNote = await NoteRepositories.deleteNoteById(id);

  if (!deletedNote) {
    return next(new NotFoundError('Catatan tidak ditemukan'));
  }

  return response(res, 200, 'Catatan berhasil dihapus', { deletedNote });
};