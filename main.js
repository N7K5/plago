
let ip_e, op_e;
let btn_change;
let slider_e, slider_val_e, slider_val;

/*
let to_be_changed= {
    "a": "а",
    "c": "с",
    // "d": "ԁ",
    "e": "е",
    // "g": "ġ",
    // "h": "һ",
    "i": "і",
    "j": "ј",
    // "k": "κ",
    // "l": "ӏ",
    "n": "ո",
    "o": "о",
    "p": "р",
    "q": "զ",
    // "u": "υ",
    // "v": "ν",
    "x": "х",
    "y": "у",
}
*/


let to_be_changed_available= {
    "a": "\u0430",
    "c": "\u0441",
    "d": "\u0501",
    "e": "\u0435",
    "g": "\u0121",
    "h": "\u04bb",
    "i": "\u0456",
    "j": "\u0458",
    "k": "\u03ba",
    "l": "\u04cf",
    "n": "\u0578",
    "o": "\u043e",
    "p": "\u0440",
    "q": "\u0566",
    "s": "\u0282",
    "u": "\u03c5",
    "v": "\u03bd",
    "x": "\u0445",
    "y": "\u0443",
    "z": "\u0290",
};

let to_be_changed= {};


let enabled_chars= ['a', 'c', 'e', 'i', 'j', 'o', 'p', 'x', 'y']



function fill_to_be_changed(enabled_chars_) {
    to_be_changed= {};
    let keys= Object.keys(to_be_changed_available);
    for(let i=0; i<keys.length; i++) {
        let c= keys[i];
        if(enabled_chars_.includes(c)) {
            to_be_changed[c]= to_be_changed_available[c];
        }
    }
}



function choosen_chars_changed(e) {

    if(e.target.checked) {
        enabled_chars.push(e.target.id)
    }
    else {
        enabled_chars = enabled_chars.filter(function(item) {
            return item != e.target.id;
        })
    }

    enabled_chars = enabled_chars.filter((value, index, self) => {
        return self.indexOf(value) === index;
    });
    
    fill_to_be_changed(enabled_chars);
}


function make_char_chooser_options() {
    let cont= document.getElementById("choosen_chars");

    let keys= Object.keys(to_be_changed_available);

    let enabled_keys= Object.keys(to_be_changed);

    for(let i=0; i<keys.length; i++) {
        let k= keys[i];

        let tx= document.createElement("div");
        tx.setAttribute("class", "single_check_and_char");
        cont.appendChild(tx);


        let x = document.createElement("INPUT");
        x.setAttribute("type", "checkbox");
        x.setAttribute("class", "char_chose_check");
        x.setAttribute("id", k);
        x.checked= false;
        if(enabled_keys.includes(k)) {
            x.checked= true;
        }
        x.addEventListener("click", choosen_chars_changed, false);
        tx.appendChild(x);

        let y = document.createElement('span');
        y.setAttribute("class", "char_chose_chars");
        y.innerText= k + " => ";
        y.innerText+= to_be_changed_available[k];
        tx.appendChild(y);

        // cont.appendChild(document.createElement('br'));

    }

}



function init() {

    ip_e= document.getElementById("ip_textarea");
    op_e= document.getElementById("op_textarea");

    btn_change= document.getElementById("change_text");
    btn_change.addEventListener("click", change_text, false);

    slider_e= document.getElementById("percent_slider");
    slider_val_e= document.getElementById("slider_value");
    slider_val= parseInt(slider_e.value)
    slider_val_e.innerText= slider_e.value+" %";
    slider_e.addEventListener("input", () => {
        let v= slider_e.value;
        slider_val_e.innerText= v+" %";
        slider_val= parseInt(v);
    }, false)


    document.getElementById("clear_text").addEventListener("click", () => {
        ip_e.value= "";
        op_e.value= "";
    }, false);


    document.getElementById("paste_ip").addEventListener("click", () => {
        ip_e.select();
        navigator.clipboard.readText()
        .then(e => {
            e= e.trim()
            console.log(e);
            if(e.length<1) {
                alert("Nothing to paste...");
                return;
            }
            ip_e.select();
            ip_e.innerText= e;
        })
    })

    document.getElementById("copy_op").addEventListener("click", () => {
        op_e.select();  
        op_e.setSelectionRange(0, 99999);
        if(op_e.value.trim().length<1) {
            alert("Nothing to copy");
            return;
        }
        navigator.clipboard.writeText(op_e.value);
        // alert("Copied to clipboard");
    })



    let settings= document.getElementById("chars_holder_x");

    settings.innerText= "S";
    settings.className="settings_open";

    settings.addEventListener("click", () => {
        let e= document.getElementById("chars_holder");
        if(e.style.right == "-5px") {
            e.style.right= "-40%";
        }
        else {
            e.style.right= "-5px";
        }


        if(settings.innerText=="S") {
            settings.innerText= "X";
            settings.className="settings_close";
        }
        else {
            settings.innerText= "S";
            settings.className="settings_open";
        }
    })



    fill_to_be_changed(enabled_chars);
    make_char_chooser_options();




    ip_e.select();


}


// function to check if changing this word breaks anything!!!
function is_changable_word(word) {
    if(word.length == 0 ) return false;
    if(word[0]=="\\") return false;
    return true;
}


function change_word(word) {

    if(word.length <1) return "";
    
    // dont change word if starts with back_slash
    if(word[0]=="\\") return word;

    // Have to check for other skips
    // like "exp" or other math functions

    res= "";
    for(let i=0; i<word.length; i++) {
        let c= word[i];
        if(to_be_changed[c] != undefined){
            c= to_be_changed[c];
        }
        res+=c;
    }

    return res;
}


function change_text() {
    let ip_str= ip_e.value.trim();
    // console.log(ip_str+"asd");
    // return;
    let op_str= "";


    if(ip_str.length<2) {
        alert("Please enter/paste some text firse...");
        return;
    }


    let words= ip_str.split(" ")
    // console.log(words);
    // return;

    // let percentage= 0.5;
    let percentage= parseInt(slider_val)/100;
    console.log(slider_val)
    // console.log(percentage)


    for(let w_id=0; w_id<words.length; w_id++) {

        let new_word= words[w_id];

        if(is_changable_word(new_word) && Math.random()<=percentage) {
            new_word= change_word(new_word);
        }

        op_str+=new_word+" "

    }

    op_e.value= op_str.trim();

}





window.addEventListener("load", init, false);



