export function stringToColor(string) {
    if(!string){
        string = "XX"
    }
    const firstAlphabet = string.charAt(0).toLowerCase();
 
    // get the ASCII code of the character
    const asciiCode = firstAlphabet.charCodeAt(0);
    
    // number that contains 3 times ASCII value of character -- unique for every alphabet
    const colorNum = asciiCode.toString() + asciiCode.toString() + asciiCode.toString();
    
    var num = Math.round(0xffffff * parseInt(colorNum));
    var r = num >> 16 & 255;
    var g = num >> 8 & 255;
    var b = num & 255;

    return 'rgb('+r+','+g+','+b+')';
}