
const members = ["유노윤호", "영웅재중", "믹키유천", "시아준수", "최강창민"];


const pairingNames = {
    "유노윤호": {
        "영웅재중": "윤재",
        "믹키유천": "투유",
        "시아준수": "호수",
        "최강창민": "호민"
    },
    "영웅재중": {
        "유노윤호": "재윤",
        "믹키유천": "웅키",
        "시아준수": "재수",
        "최강창민": "중심"
    },
    "믹키유천": {
        "유노윤호": "믹윤",
        "영웅재중": "천재",
        "시아준수": "유수",
        "최강창민": "키스"
    },
    "시아준수": {
        "유노윤호": "수호",
        "영웅재중": "수재",
        "믹키유천": "아키",
        "최강창민": "시민"
    },
    "최강창민": {
        "유노윤호": "창윤",
        "영웅재중": "창재",
        "믹키유천": "스키",
        "시아준수": "밍샤"
    }
};

const table = document.getElementById("preference-chart");
const popup = document.getElementById("preference-popup");
const overlay = document.getElementById("popup-overlay");
let selectedCell = null;
let selectedRow = null;
let selectedColumn = null;

const headerRow = document.createElement("tr");

const corner = document.createElement("th");
corner.textContent = "";
headerRow.appendChild(corner);


members.forEach(function (member) {
    const cell = document.createElement("th");
    cell.textContent = member;
    cell.style.cursor = "pointer";

    cell.addEventListener("click", function() {
        selectedColumn = member;
        selectedCell = null;
        selectedRow = null;
        popup.hidden = false;
        overlay.hidden = false;
    });

    headerRow.appendChild(cell);
});


table.appendChild(headerRow);

members.forEach(function (rowmember) {
    const row = document.createElement("tr");

    
const nameCell = document.createElement("th");
nameCell.textContent = rowmember;

nameCell.style.cursor = "pointer";

nameCell.addEventListener("click", function() {
    selectedRow = row;
    selectedCell = null;
    selectedColumn = null;
    popup.hidden = false;
    overlay.hidden = false;
});

row.appendChild(nameCell);


    members.forEach(function (colmember) {
        const cell = document.createElement("td");

        if (rowmember === colmember) {
            cell.textContent = "-";
        } else {
            cell.textContent = pairingNames[rowmember][colmember];
            cell.dataset.pair = rowmember + "-" + colmember;
            
            const savedPreference = localStorage.getItem(cell.dataset.pair);

            if (savedPreference !== null) {
                cell.dataset.preference = savedPreference;
            }

            
            cell.addEventListener("click", function () {
                selectedCell = cell;
                selectedRow = null;
                selectedColumn = null;
                popup.hidden = false;
                overlay.hidden = false;
            });

        }

        row.appendChild(cell);
    });

    table.appendChild(row);

});


const preferenceButtons = document.querySelectorAll("#preference-popup button[data-preference]");


preferenceButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        const preference = button.dataset.preference;

        if (selectedCell !== null) {
            selectedCell.dataset.preference = preference;
            localStorage.setItem(selectedCell.dataset.pair, preference);
        }

        if (selectedRow !== null) {
            selectedRow.querySelectorAll("td[data-pair]").forEach(function(cell) {
                cell.dataset.preference = preference;
                localStorage.setItem(cell.dataset.pair, preference);
            });
        }

        
        if (selectedColumn !== null) {
            document.querySelectorAll("#preference-chart td[data-pair]").forEach(function(cell) {
                if (cell.dataset.pair.split("-")[1] === selectedColumn) {
                    cell.dataset.preference = preference;
                    localStorage.setItem(cell.dataset.pair, preference);
                }
            });
        }

        popup.hidden = true;
        overlay.hidden = true;
        selectedCell = null;
        selectedRow = null;
        selectedColumn = null;  
    });
});


const cancelButton = document.getElementById("cancel-button");
const clearButton = document.getElementById("clear-button");
cancelButton.addEventListener("click", function() {
    popup.hidden = true;
    overlay.hidden = true;
    selectedCell = null;
    selectedRow = null;
    selectedColumn = null;
});

clearButton.addEventListener("click", function() {
    if (selectedCell !== null) {
        delete selectedCell.dataset.preference;
        localStorage.removeItem(selectedCell.dataset.pair);
    }

    if (selectedRow !== null) {
        selectedRow.querySelectorAll("td[data-pair]").forEach(function(cell) {
            delete cell.dataset.preference;
            localStorage.removeItem(cell.dataset.pair);
        });
    }

    if (selectedColumn !== null) {
        document.querySelectorAll("#preference-chart td[data-pair]").forEach(function(cell) {
            if (cell.dataset.pair.split("-")[1] === selectedColumn) {
                delete cell.dataset.preference;
                localStorage.removeItem(cell.dataset.pair);
            }
        });
    }

    popup.hidden = true;
    overlay.hidden = true;
    selectedCell = null;
    selectedRow = null;
    selectedColumn = null;
});



overlay.addEventListener("click", function() {
    popup.hidden = true;
    overlay.hidden = true;
    selectedCell = null;
    selectedRow = null;
    selectedColumn = null;
});


const resetAllButton = document.getElementById("reset-all-button");

resetAllButton.addEventListener("click", function() {
    const confirmed = confirm("모든 내역을 초기화할까요? 이 작업은 되돌릴 수 없습니다.");

    if (confirmed) {
        document.querySelectorAll("#preference-chart td[data-pair]").forEach(function(cell) {
            delete cell.dataset.preference;
            localStorage.removeItem(cell.dataset.pair);
        });
    }
});


const saveImageButton = document.getElementById("save-image-button");

saveImageButton.addEventListener("click", async function() {
    const captureArea = document.getElementById("capture-area");

    
const canvas = await html2canvas(captureArea, {
    backgroundColor: "#FFFFFF",
    scale: 2,
    onclone: function(clonedDocument) {
        const clonedArea = clonedDocument.getElementById("capture-area");
        const clonedContainer = clonedDocument.getElementById("chart-container");

        clonedArea.style.width = "max-content";
        clonedArea.style.maxWidth = "none";

        clonedContainer.style.width = "auto";
        clonedContainer.style.overflow = "visible";
    }
});


    
const fileName = "돖페스_취향표.png";

const blob = await new Promise(function(resolve) {
    canvas.toBlob(resolve, "image/png");
});

if (!blob) {
    alert("이미지를 생성하지 못했어요. 다시 시도해 주세요.");
    return;
}

const file = new File([blob], fileName, {
    type: "image/png"
});

if (
    navigator.share &&
    navigator.canShare &&
    navigator.canShare({ files: [file] })
) {
    try {
        await navigator.share({ files: [file] });
        return;
    } catch (error) {
        if (error.name === "AbortError") {
            return;
        }
    }
}

const link = document.createElement("a");
const url = URL.createObjectURL(blob);

link.href = url;
link.download = fileName;
document.body.appendChild(link);
link.click();
link.remove();

setTimeout(function() {
    URL.revokeObjectURL(url);
}, 60000);

});
