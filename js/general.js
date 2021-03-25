/*-------------------VARIABLES-----------------------------*/
const writeScreen = document.querySelector(".write");
let inputArea = document.getElementById("0");
let newMathArray = [];
let elementCounter = 1;
let areaFocus = 0;
let auxiliarFocus;
let colorSelected = "#292929";
let MQ = MathQuill.getInterface(2); //crea el primer input de mathquill
let mathField = MQ.MathField(inputArea);
/*-----------------------------------------------------------*/

//Inicializar elementos del dom
writeScreen.style.color = "white";
newMathArray.push(mathField);
mathField.focus();
newMathArray[areaFocus].el().style.backgroundColor = "rgb(51,51,51)";
document.querySelector("header").style.backgroundColor = "white";


x = {
    aInternal: areaFocus,
    aListener: function(val) {},
    set a(val) {
        this.aInternal = val; //Listener para la variable de cambio de foco, al detectar que el foco cambia se dispara
        this.aListener(val);
    },
    get a() {
        return this.aInternal;
    },
    registerListener: function(listener) {
        this.aListener = listener;
    }
};

x.registerListener(function(val) {
   //Cambia el background color donde el focus esté
    try {
        newMathArray[auxiliarFocus].el().style.backgroundColor = colorSelected;

    } catch (e) {} finally {

        newMathArray[areaFocus].el().style.backgroundColor = "rgb(51,51,51)";
    };

});


writeScreen.onkeydown = e => { //teclas de control de inputs

    switch (e.which) {
        case 38:
            goAbove();
            break;
        case 40:
            goBelow();
            break;
        case 13:
            newInput();
            break;
        case 8:
            deleteInput();
            break;
    };
}


function deleteInput() { //borra un input determinado
    if (newMathArray[areaFocus].latex().length == 0) {
        if (areaFocus > 0) {
            for (let i = areaFocus + 1; i < document.getElementsByClassName('input').length; i++) {
                document.getElementsByClassName("input")[i].id -= 1;
            };
            newMathArray[areaFocus].el().remove();
            newMathArray.splice(areaFocus, 1);
            elementCounter -= 1;
            goAbove();
        };
    };
};

function goBelow() { //mueve el foco para abajo
    if (areaFocus < elementCounter - 1) {
        areaFocus += 1;
        newMathArray[areaFocus].focus();
        auxiliarFocus = areaFocus - 1;
        x.a = areaFocus;
    };

};


function goAbove() { //mueve el foco para arriba
    if (areaFocus > 0) {
        areaFocus -= 1
        newMathArray[areaFocus].focus();
        auxiliarFocus = areaFocus + 1;
        x.a = areaFocus;
    };
};

function newInput() { //se crea un nuevo input

    newMathArray[areaFocus].el().insertAdjacentHTML('afterend', '<span id=\"' + elementCounter + '\" class=\"input\"></span>');
    let newMath = MQ.MathField(document.getElementById(elementCounter));
    if (elementCounter - 1 === areaFocus) { //Si el nuevo input se da después del último se agrega directamente al array con un push
        newMathArray.push(newMath);
    } else { //si el nuevo input se da en medio de otros inputs, se re acomodan los id, y el array también

        for (let k = areaFocus + 1; k < document.getElementsByClassName("input").length; k++) {

            try {
                document.getElementsByClassName("input")[k].id = document.getElementsByClassName("input")[k + 1].id;
            } catch (e) {};
        };
        document.getElementsByClassName("input")[elementCounter].id = elementCounter;
        newMathArray.splice(areaFocus + 1, 0, newMath);
    };
    elementCounter += 1;
    goBelow();


};

document.addEventListener('click', function(e) { //cambia el foco manualmente al hacer click sobre un input
    elementFocused = e.target.parentElement;
    if (elementFocused.id != "") {
        auxiliarFocus = areaFocus;
        areaFocus = parseInt(elementFocused.id);
        x.a = areaFocus;

    } else {
        newMathArray[areaFocus].el().style.backgroundColor = colorSelected;
    }

});

document.querySelector(".color-picker-input").addEventListener("change", () => {
  //obtiene el valor del input de color de la fuente
    let fontColor = document.querySelector(".color-picker-input").value;
    writeScreen.style.color = fontColor;

});

document.querySelector(".background-picker-input").addEventListener("change", () => {
  //obtiene el valor del input de color de fondo

    colorSelected = document.querySelector(".background-picker-input").value;
    writeScreen.style.backgroundColor = colorSelected;
    for (let i = 0; i < document.getElementsByClassName("input").length; i++) {
        document.getElementsByClassName("input")[i].style.backgroundColor = colorSelected;
    };

});


document.querySelector(".button-3").addEventListener("click", () => { //abre y cierra el selector de colores

    document.querySelector(".color-picker").classList.toggle("transformPicker");

});


document.querySelector(".button-2").addEventListener("click", () => {
  //cambia el modo de interface dia/nocturno
    if (document.querySelector("header").style.backgroundColor != "white") {
        changeInterfaceColor("white", "black", "translateX(-200%)", "translateX(0%)");
    } else {
        changeInterfaceColor("black", "white", "translateX(0%)", "translateX(200%)");
    };


});

function changeInterfaceColor(backgroundColor, fontColor, firstShift, lastShift) {
  //cambia la interface
    document.querySelector(".color-picker").style.backgroundColor = backgroundColor;
    document.querySelector(".color-picker .font-picker p").style.color = fontColor;
    document.querySelector(".color-picker .background-picker p").style.color = fontColor;
    document.querySelector("header").style.backgroundColor = backgroundColor;
    document.querySelector("h1").style.color = fontColor;
    document.querySelector(".header-tools").style.backgroundColor = backgroundColor;
    for (let j = 0; j < document.getElementsByClassName("line").length; j++) {
        document.getElementsByClassName("line")[j].style.backgroundColor = fontColor;
    };
    for (let i = 0; i < document.getElementsByClassName("item").length; i++) {

        document.getElementsByClassName("item")[i].style.backgroundColor = backgroundColor;
        document.getElementsByClassName("item")[i].style.color = fontColor;
    };

    document.querySelector(".sun-icon").style.transform = firstShift;
    document.querySelector(".moon-icon").style.transform = lastShift;
    document.querySelector(".download-box").style.backgroundColor = backgroundColor;
    document.querySelector(".download-box p").style.color = fontColor;
    document.querySelector(".downloading-circle").style.border = "7px solid " + backgroundColor;
    document.querySelector(".downloading-circle").style.borderTop = "7px solid " + fontColor;

};

document.querySelector(".button-1").addEventListener("click", () => { // crea un nuevo pdf
    preparePrintDOM("none", "flex");
    const newDoc = new jsPDF("portrait", "mm");
    let pagesDoc = elementCounter / 30;
    pagesDoc = Math.ceil(pagesDoc);         //cálculo de la cantidad de páginas a usar
    let auxiliarCounter = 1110;
    let height = document.getElementsByClassName("input")[elementCounter - 1].offsetTop + 37;
    /*el valor del contador auxiliar se atribuye a que por cada 1110px se puede visualizar
    el contenido de la siguiente página, la primera iteración lo dejará en 0*/
    for (let i = 0; i <= pagesDoc; i++) {
        if(i== pagesDoc){
          height = document.getElementsByClassName("input")[elementCounter - 1].offsetTop + 37 + 2000;
        };
        if (i < pagesDoc) {

            auxiliarCounter -= 1110;
        };
        html2canvas(writeScreen, {
            windowHeight: height,
            height: height,
            width: 794,
            windowWidth: 794,
            scrollY: auxiliarCounter,
            //aquí se usa el contador para sabér cuánto moverse para imprimir la siguiente página
        }).then(function(canvas) {
            if (i >= 1 && i < pagesDoc) {

                newDoc.addPage();
            };
            newDoc.addImage(canvas.toDataURL(), "JPEG", 0, 0);
            if (i == pagesDoc) {   //cuando el for llegue a su última iteración, se genera el pdf

                newDoc.save("math-document.pdf");
                setTimeout(() => {
                    preparePrintDOM("flex", "none")
                }, 1500);
            };

        });
    };

});



function preparePrintDOM(inverseDownloadBox, downloadBox) {
  // prepara el DOM, es decir, quita de pantalla todo lo que no se va a utlizar en el pdf
    document.querySelector(".color-picker").style.display = inverseDownloadBox;
    newMathArray[areaFocus].el().style.backgroundColor = colorSelected;
    for (let i = 0; i < document.getElementsByClassName("input").length; i++) {
        if (inverseDownloadBox == "none") {
            document.getElementsByClassName("input")[i].classList.add("noBorders");
        } else {
            document.getElementsByClassName("input")[i].classList.remove("noBorders");
        };

    };
    document.querySelector(".download-section").style.display = downloadBox; // muestra de pantalla de carga

}

for (let x = 0; x < document.getElementsByClassName("rb").length; x++) {
    document.getElementsByClassName("rb")[x].onclick = function() { //detecta algún click en un radio-button
        if (document.getElementsByClassName("rb")[x].value == "background") {
            changePicker("translateX(0)", "translateX(-100%)");
        } else {

            changePicker("translateX(100%)", "translateX(0)");
        };
    };
};

function changePicker(firstTranslate, lastTranslate) {
  //cambia la posición de los pickers al cambiar el valor de los radio-buttons

    document.querySelector(".background-picker").style.transform = firstTranslate;
    document.querySelector(".font-picker").style.transform = lastTranslate;
};
