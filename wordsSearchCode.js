({ data: { newLink, oldLink }, deep, require }) => {
  if (!newLink?.value?.value) return;

  const Word = Number(deep.id('@deep-foundation/splitting-text-into-words-alt', 'Word'));
  const Count = Number(deep.id('@deep-foundation/splitting-text-into-words-alt', 'Count'));
  const Post = Number(deep.id('@deep-foundation/rss-to-deep', 'Post'));

  let words = (newLink?.value?.value || "").replaceAll("\n", "").trim().toLowerCase().split(' ').filter(w => w.length > 2);
  // let updates = [];
  let wordCounts = {};
  const wordsHash = {};
  try {
    for (let word of words) {
      if (word && word.length) {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      }
    }
    // let existedCounts = {}
    for (let word of words) {
      if (wordsHash[word]) continue;
      wordsHash[word] = true;
      var { data: [foundedWord] } = deep.select({ type_id: Word, string: { value: word } });
      if (!foundedWord) {
        var wordLink = deep.insert({ type_id: Word, string: word });
        foundedWord = wordLink.data[0]
      }

      let countLink = deep.select({ type_id: Count, to_id: foundedWord.id, from_id: newLink.id })
      let count_data = countLink.data;
      if (!count_data.length) {
        countLink = deep.insert({ type_id: Count, number: wordCounts[word], from_id: newLink.id, to_id: foundedWord.id });
        count_data = countLink.data;
      }
      else {
        // updates.push([word, { link_id: count_data[0].id }, { value: wordCounts[word] }, { table: 'numbers' }]);
        deep.update({ link_id: count_data[0].id }, { value: wordCounts[word] }, { table: 'numbers' });
      }
      // existedCounts[count_data[0].id] = true
    }

    // let oldCounts = deep.select({ type_id: Count, from_id: Number(newLink.id) })
    // let oldCounts_data = oldCounts.data
    // for (let link of oldCounts_data) {
    //     if (!existedCounts[link.id]) {
    //         deep.delete(Number(link.id))
    //     }
    // }
  } catch (error) {
    // throw new Error(JSON.stringify({ value: newLink?.value?.value, id: Number(newLink.id), words, error, updates, wordCounts }));
    throw new Error(error);
  }
}