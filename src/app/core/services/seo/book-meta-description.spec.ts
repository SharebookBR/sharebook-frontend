import { buildBookMetaDescription } from './book-meta-description';

describe('buildBookMetaDescription', () => {
  it('keeps a complete first sentence when it fits the target length', () => {
    const description = buildBookMetaDescription({
      title: 'Basic Analysis I: Introduction to Real Analysis, Volume I',
      author: 'Jiří Lebl',
      type: 'Eletronic',
      synopsis: 'Real analysis becomes manageable when abstraction grows from familiar ground. The next sentence does not fit.',
    });

    expect(description).toBe(
      'Livro digital: Basic Analysis I: Introduction to Real Analysis, Volume I, de Jiří Lebl. Real analysis becomes manageable when abstraction grows from familiar ground.'
    );
    expect(description.length).toBe(165);
  });

  it('truncates a long first sentence at a word boundary', () => {
    const description = buildBookMetaDescription({
      title: 'Álcoois: poemas (1898–1913) — edição bilíngue',
      author: 'Guillaume Apollinaire',
      type: 'Printed',
      synopsis: 'Publicado originalmente em 1913, Álcoois reúne poemas escritos por Guillaume Apollinaire entre 1898 e 1913 e ocupa um lugar decisivo na passagem para a poesia moderna.',
    });

    expect(description).toBe(
      'Livro físico: Álcoois: poemas (1898–1913) — edição bilíngue, de Guillaume Apollinaire. Publicado originalmente em 1913, Álcoois reúne poemas escritos por Guillaume…'
    );
    expect(description.length).toBeLessThanOrEqual(170);
  });

  it('keeps a short synopsis intact', () => {
    const description = buildBookMetaDescription({
      title: 'Livro breve',
      author: 'Autora',
      type: 'Printed',
      synopsis: 'Uma leitura curta e direta.',
    });

    expect(description).toBe(
      'Livro físico: Livro breve, de Autora. Uma leitura curta e direta.'
    );
  });

  it('uses a useful fallback when the synopsis is empty', () => {
    const description = buildBookMetaDescription({
      title: 'Livro sem sinopse',
      author: 'Autor',
      type: 'Printed',
      synopsis: '   ',
    });

    expect(description).toBe(
      'Livro físico: Livro sem sinopse, de Autor. Conheça esta obra no ShareBook.'
    );
  });

  it('normalizes line breaks and repeated whitespace', () => {
    const description = buildBookMetaDescription({
      title: 'Livro digital',
      author: 'Autora',
      type: 'Eletronic',
      synopsis: 'Primeira frase.\n\n  Segunda   frase.',
    });

    expect(description).toBe(
      'Livro digital: Livro digital, de Autora. Primeira frase. Segunda frase.'
    );
  });

  it('remains valid when the author is absent', () => {
    const description = buildBookMetaDescription({
      title: 'Obra anônima',
      author: '',
      type: 'Eletronic',
      synopsis: 'Uma sinopse curta.',
    });

    expect(description).toBe(
      'Livro digital: Obra anônima. Uma sinopse curta.'
    );
  });
});
