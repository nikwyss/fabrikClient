// http://jsfiddle.net/w665x/138/

var popupLibrary = {

    FindLeftWindowBoundry() {
        // In Internet Explorer window.screenLeft is the window's left boundry
        if (window.screenLeft)
        {
            return window.screenLeft;
        }

        // In Firefox window.screenX is the window's left boundry
        if (window.screenX)
            return window.screenX;
        return 0;
    },

    // Find Left Boundry of current Window
    FindTopWindowBoundry() {
        // In Internet Explorer window.screenLeft is the window's left boundry
        if (window.screenTop)
        {
            return window.screenTop;
        }

        // In Firefox window.screenY is the window's left boundry
        if (window.screenY)
            return window.screenY;

        return 0;
    },

    openpopup(url) {
        console.log(this.FindLeftWindowBoundry(), this.FindTopWindowBoundry());
        var x = screen.width/2 - 700/2 + this.FindLeftWindowBoundry();
        var y = screen.height/2 - 450/2 + this.FindTopWindowBoundry();
        window.open(url, 'sharegplus','height=485,width=700,left='+x+',top='+y);
    }
}

export default popupLibrary
