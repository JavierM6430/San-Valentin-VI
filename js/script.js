function startTyping() {
    const container = document.querySelector('.vi-message');
    const text = "i love you";

    let indiceTextIntro = 0;

    if (!container) return;

    container.textContent = "";

    setTimeout(() => {
      
        let typing = setInterval(() => {
            if (indiceTextIntro < text.length) {
                container.textContent += text[indiceTextIntro];
                indiceTextIntro++; 
            } else {
                clearInterval(typing);
                
                setTimeout(() => {
                    Alpine.store('intro').introFinished = true;
                }, 3000);
            }
        }, 120);
    }, 5000);
  }

function sectionHero() {
    return {
        phrases: [
            '6 Años de este hermoso amor',
            'Eres la mujer de mis sueños',
            'Contigo supe lo que es amar',
            'Le pones color a todo mi mundo',
            'Feliz San Valentin amor',
            'Somos como la milanesa y el puré; la mejor combinación'
        ],

        images: [
            '/img/card/img16.jpg','/img/card/img5.jpg','/img/card/img6.jpg',
            '/img/card/img1.jpg','/img/card/img15.jpg','/img/card/img9.jpg',
            '/img/card/img8.jpg','/img/card/img3.jpg','/img/card/img11.jpg',
            '/img/card/img7.jpg','/img/card/img10.jpg','/img/card/img14.jpg',
            '/img/card/img17.jpg','/img/card/img13.jpg','/img/card/img4.jpg',
            '/img/card/img12.jpg','/img/card/img18.jpg','/img/card/img2.jpg'
        ],

        currentPhraseIndex: 0,
        displayedText: '',
        charIndex: 0,
        writingInterval: null,
        isVisible: true,
        page: 0,
        perPage: 6,
        interval: null,

        preloadImages() {
            this.images.forEach(src => {
                const img = new Image();
                img.src = src;
            });
        },


        init() {
            this.preloadImages();

            // si ya entró al main
            if (Alpine.store('app').step === 'main') {
                this.startPhrases();
                this.startImages();
            }

            // escuchar cambios de step
            this.$watch(
                () => Alpine.store('app').step,
                value => {
                    if (value === 'main') {
                        this.startPhrases();
                        this.startImages();
                    }
                }
            );
        },

        startImages() {
            if (this.interval) return;

            this.isVisible = true;

            this.interval = setInterval(() => {
                this.isVisible = false;
                
                setTimeout(() => {
                    this.page = (this.page + 1) % Math.ceil(this.images.length / this.perPage);
                    
                    requestAnimationFrame(() => {
                        this.isVisible = true;
                    });
                }, 1800)
            }, 10000)

        },

        img(slot) {
            return this.images[this.page * this.perPage + slot]
        },

        startPhrases() {
            console.log('🚀 startPhrases');
            this.reset();
            this.typeWriter();
        },

        typeWriter() {
            this.writingInterval = setInterval(() => {
                const phrase = this.phrases[this.currentPhraseIndex];

                if (this.charIndex === phrase.length) {
                    clearInterval(this.writingInterval);
                    setTimeout(() => this.erase(), 5000);
                    return;
                }

                this.displayedText += phrase[this.charIndex];
                this.charIndex++;
            }, 70);
        },

        erase() {
            const erasing = setInterval(() => {
                if (this.charIndex === 0) {
                    clearInterval(erasing);
                    this.nextPhrase();
                    return;
                }

                this.displayedText = this.displayedText.slice(0, -1);
                this.charIndex--;
            }, 50);
        },

        nextPhrase() {
            this.currentPhraseIndex =
                (this.currentPhraseIndex + 1) % this.phrases.length;
            this.reset();
            this.typeWriter();
        },

        reset() {
            this.displayedText = '';
            this.charIndex = 0;
        }
    }
}
