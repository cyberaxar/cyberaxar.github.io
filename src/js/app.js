class App {
    constructor() {
        this.nav = document.querySelector(".nav");
        this.isNavOpen = false;
        this.printCopyright();
    }

    toggleNav = () => {
        this.isNavOpen = !this.isNavOpen;
        this.nav.style.width = this.isNavOpen ? "100%" : "0";
    };


    printCopyright = () => {
        const footer = document.querySelector(".footer");
        if (!footer) return;
        const year = new Date().getFullYear();
        footer.innerHTML = `&copy; ${year} - Cyber Axar`;
    };
}

const app = new App();
