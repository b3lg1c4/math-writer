/*-------------------VARIABLES-----------------------------*/
elements = document.getElementsByClassName("item");
let toolsElements = document.getElementsByClassName("tool-element");
let slideIndex = 0;
/*-------------------VARIABLES-----------------------------*/


for (let i = 0; i < elements.length; i++) {

    MQ.StaticMath(elements[i]); //produce un math input estático por cada botón
};

document.querySelector(".b-right").onclick = () => { // mover slide a la derecha
    slideIndex += 1;
    moveSlide();
}

document.querySelector(".b-left").onclick = () => { // mover slide a la izqquierda
    slideIndex -= 1;
    moveSlide();
}


function moveFirstLastSlider(movement) { // mueve el slide al último clon

    document.querySelectorAll(".tool-element").forEach((tool, i) => {
        tool.style.transition = "all .5s ease";
        tool.style.transform = "translateX(" + ((i * 100) + movement).toString() + "%)";
    });
}


function changeTransitions(state) {
    document.querySelectorAll(".tool-element").forEach((tool) => {
        tool.style.transition = state; //cambia el estado de las transiciones
    });
};


function moveInvertSlider(slideValue) {
    //Cuando se posiciona en el clon, el slide se cambia bruscamente a su correcta posición
    setTimeout(() => { //el timeout es para dejar que la transición se ejecute con normalidad
        changeTransitions("none");
        slideIndex = slideValue;
        for (let j = 0; j < toolsElements.length; j++) {
            toolsElements[j].style.transform = "translateX(-" + slideIndex * 100 + "%)";
        };
    }, 500);
};



function moveSlide() { //posiciona el slide en función a los botones que se documentan arriba
    let i = -1;
    if (slideIndex < 0) {
        moveFirstLastSlider(100);
        moveInvertSlider(toolsElements.length - 3);

    } else if (slideIndex > toolsElements.length - 3) {
        moveInvertSlider(0);
    };
    changeTransitions("all .5s ease");
    do {
        i += 1;
        if (i < toolsElements.length) {
            toolsElements[i].style.transform = "translateX(-" + slideIndex * 100 + "%)";

        };

    } while (i < toolsElements.length);

};

for (let i = 0; i < document.getElementsByClassName("item").length; i++) { //agarra el evento para c/botón
    document.getElementsByClassName("item")[i].onclick = () => {
        let equationValue = document.getElementsByClassName("item")[i].querySelectorAll("span")[0].textContent;
        equationValue = equationValue.slice(1, equationValue.length - 1);
        writeOnInput(purifyEquation(equationValue));
    };

};

function purifyEquation(value) { //limpia y acomoda el valor de los botones para imprimir en el DOM
    switch (value) {
        case "\\frac{a}{b}":
            value = "\\frac{}{}";
            break;
        case "\\lim_{x\\to a}":
            value = "\\lim_{x\\to {}}";
            break;
        case "\\mathbb{R}":
            value = "ℝ";
            break;
        case "\\mathbb{Z}":
            value = "ℤ";
            break;
        case "\\mathbb{Q}":
            value = "ℚ";
            break;
        case "\\mathbb{C}":
            value = "ℂ";
            break;
        case "\\mathbb{N}":
            value = "ℕ";
            break;
        case "\\int_a^b":
            value = "\\int{_{}^{}}";
            break;
        case "x^n":
            value = "^{}";
            break;
        case "\\sqrt[n]{x}":
            value = "\\sqrt[]{}";
            break;
    }

    return value;
}


function writeOnInput(value) {
    //Escribe en el DOM en el input deseado el valor seleccionado de un botón del toolbar
    newMathArray[areaFocus].cmd(value);
    newMathArray[areaFocus].latex(newMathArray[areaFocus].latex());
    newMathArray[areaFocus].focus();
}
