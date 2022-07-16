
export default function creatInput() {
    var dom = document.createElement('input')
    dom.setAttribute('type', 'file')
    dom.setAttribute('multiple', '')
    dom.onchange = function (e) {
        for (let i = 0; i < dom.files.length; i++) {
            const item = dom.files[i]
            read_getBase64(item)
        }
    }
    dom.click()
}

function read_getBase64(file) {
    var reader = new FileReader();
    reader.onload = function (evt) {
        console.log(evt.target.result)
    }
    reader.readAsDataURL(file);
}
