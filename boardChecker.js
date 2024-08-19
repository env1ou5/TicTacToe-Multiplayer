
const columns = 5;
const AmtToWin = 5;

function CheckVertical([spot, progress, bnsfilled]) {

    if (progress >= AmtToWin) {
        return true;
    }

    let tempkey = bnsfilled[spot];
    let nextspot = Number(spot) + Number(columns);
    let nextspotelement = document.getElementById(nextspot);

    if (nextspotelement != null && tempkey == bnsfilled[nextspot]) {
        return CheckVertical([nextspot, progress + 1, bnsfilled]);
    }
    
    return false;
}

function CheckHorizontal([spot, progress, bnsfilled]) {

    if (progress >= AmtToWin) {
        return true;
    }

    let tempkey = bnsfilled[spot];
    let nextspot = Number(spot) + 1;
    
    let spotelement = document.getElementById(spot);
    let nextspotelement = document.getElementById(nextspot);

    if (nextspotelement != null) {
        let spotrowN = spotelement.parentElement.id.split("_")[1];
        let nextspotrowN = nextspotelement.parentElement.id.split("_")[1];
        
        if (tempkey == bnsfilled[nextspot] && spotrowN == nextspotrowN) {     
            return CheckHorizontal([nextspot, progress + 1, bnsfilled]);
        } 
    }
    
    return false;
}

function CheckDStairs([spot, progress, bnsfilled]) {
    
    if (progress >= AmtToWin) {
        return true;
    }
    
    let tempkey = bnsfilled[spot];
    let nextspot = Number(spot) + columns + 1;
    
    let spotelement = document.getElementById(spot);
    let nextspotelement = document.getElementById(nextspot);

    if (nextspotelement != null) {
        let spotrowN = spotelement.parentElement.id.split("_")[1];
        let nextspotrowN = nextspotelement.parentElement.id.split("_")[1];
        
        if (tempkey == bnsfilled[nextspot] && spotrowN == nextspotrowN - 1) {
            return CheckDStairs([nextspot, progress + 1, bnsfilled]);
        } 
    }
    
    return false;
}

function CheckUStairs([spot, progress, bnsfilled]) {
    
    if (progress >= AmtToWin) {
        return true;
    }

    let tempkey = bnsfilled[spot];
    let nextspot = Number(spot) + columns - 1;

    let spotelement = document.getElementById(spot);
    let nextspotelement = document.getElementById(nextspot);

    if (nextspotelement != null) {
        let spotrowN = spotelement.parentElement.id.split("_")[1];
        let nextspotrowN = nextspotelement.parentElement.id.split("_")[1];
        
        if (tempkey == bnsfilled[nextspot] && spotrowN == nextspotrowN - 1) { 
            return CheckUStairs([nextspot, progress + 1, bnsfilled]);
        } 
    }

    return false;
}

const CheckCombination = (spot, bnsfilled) => {
    
    let params = [spot, 1, bnsfilled];
    return CheckVertical(params) || CheckHorizontal(params) || CheckDStairs(params) || CheckUStairs(params)
};

export default (bnsfilled) => {

    for (const [i, v] of Object.entries(bnsfilled)) {
        
        if (CheckCombination(i, bnsfilled)) {
            return [true, bnsfilled[i]];
        }
    }

    return [false, null];  
};


