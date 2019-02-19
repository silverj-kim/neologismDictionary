let currnetWord = '';

window.onload = function () {
    document.getElementById("search-button").addEventListener("click", searchClick);
    document.getElementById("add-word").addEventListener("click", addWordClick);
    document.getElementById("addButton").addEventListener("click", addWord);
}

function searchClick() {
    console.log("search");
    let xhr = new XMLHttpRequest();

    let searchWord = document.getElementById('search-text').value;
    let url = 'http://localhost:8000/find?searchWord=' + searchWord;

    if (!xhr)
        return false;

    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
        if (xhr.status === 200) {
            let response = xhr.response;
            document.getElementById('word').innerHTML = response.meaning;

            if (response.isFound === false) {
                document.getElementById('add-word').style.display = 'inline';
            }
            else{
                document.getElementById('add-word').style.display = 'none';
            }
            document.getElementById('popularWordRanking').style.display = 'none';
        }
        else
            return xhr.status;
    }
    currnetWord = searchWord;
    xhr.send();
}

function addWordClick() {
    document.getElementById('addWord').style.display = 'block';
    document.getElementById('wordToAdd').value = currnetWord;
}

function addWord() {

    if (document.getElementById("wordToAdd").value === null || document.getElementById("meaningToAdd").value === null) {
        return alert("단어와 뜻을 모두 써주세요.");
    }

    let url = 'http://localhost:8000/insert'

    let word = document.getElementById("wordToAdd").value;
    let meaning = document.getElementById("meaningToAdd").value;

    // let formData = new FormData();
    // formData.append("name", word);
    // formData.append("meaning", meaning);

    let data = {
        "name": word,
        "meaning": meaning
    }

    let xhr = new XMLHttpRequest();
    xhr.open('POST', url);

    xhr.responseType = 'json';
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(data));
    xhr.onload = () => {
        if (xhr.status === 200) {
            let response = JSON.stringify(xhr.response);
            console.log(response);
            alert("신조어 추가 완료");
            location.reload();
        }
        else
            console.log(xhr.response);
    };

}