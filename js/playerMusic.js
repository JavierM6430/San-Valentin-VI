function playerMusic() {
    return {
        // ESTADOS
        isPlaying : false,
        progress: 0,
        duration: 0, 
        currentTime: 0,
        isDragging: false,
        currentIndexMusic: 0,

        // ACCIONES

        playList: [
            {
                title: 'M.A.I',
                artist: 'Milo J',
                src: '/mp3/playList/MILO J - M.A.I.mp3',
                cover: '/img/playList/mai - logo.jpg'
            },
            {
                title: 'Dardos',
                artist: 'Romeo Santos ft. Prince Royce',
                src: '/mp3/playList/Romeo Santos & Prince Royce - Dardos.mp3',
                cover: '/img/playList/dardos - logo.jpg'
            },
            {
                title: 'Coldest Winter',
                artist: 'Odetari',
                src: '/mp3/playList/Odetari - COLDEST WINTER.mp3',
                cover: '/img/playList/odetari - logo.jpg'
            },
            {
                title: 'Would You Fall in Love with Me Again',
                artist: 'Jorge Rivera-Herrans ft. Anna Lea',
                src: '/mp3/playList/EPIC The Musical - Would You Fall in Love with Me Again.mp3',
                cover: '/img/playList/epic - logo.jpg'
            },
            {
                title: 'Feel It',
                artist: 'D4dv',
                src: '/mp3/playList/Feel It - d4vd.mp3',
                cover: '/img/playList/Feel It - logo.jpg'
            },
            {
                title: 'Space Sex',
                artist: 'COSMIC KID',
                src: '/mp3/playList/Space Sex - Cosmic Kid.mp3',
                cover: '/img/playList/Space Sex - logo.jpg'
            }
        ],

        currentSong() {
            return this.playList[this.currentIndexMusic];
        },

        togglePlayPause() {

            if (!this.isPlaying) {
                this.isPlaying = true;
                this.$refs.audio.play();

            } else {
                this.isPlaying = false;
                this.$refs.audio.pause();
            }
        },

        updateProgress() {
            const audio = this.$refs.audio;

            this.currentTime = audio.currentTime;
            this.duration = audio.duration;

            if (!isNaN(audio.duration) && audio.duration > 0) {
                this.progress = (audio.currentTime / audio.duration) * 100
            }
        },

        formatTime(seconds) {
            if (isNaN(seconds)) return '0:00';

            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);

            return `${mins}:${secs.toString().padStart(2, '0')}`;
        },

        progressPercent() {
            if (!this.duration) return 0;

            return (this.currentTime / this.duration) * 100;
        },

        next() {
            this.currentIndexMusic = (this.currentIndexMusic + 1) % this.playList.length;

            this.reloadAndPlay();
        },

        prev() {
            if (this.currentTime > 3) {
                this.restartSong();
                return;
            }

            this.currentIndexMusic = 
            (this.currentIndexMusic - 1 + this.playList.length) % this.playList.length;

            this.reloadAndPlay()
        },

        reloadAndPlay() {
            const audio = this.$refs.audio;

            this.isPlaying = false;

            audio.pause();
            audio.currentTime = 0;
            audio.load();

            audio.onloadedmetadata = () => {
                audio.play();
                this.isPlaying = true;
            };

            this.currentTime = 0;
            this.progress = 0;
        },

        restartSong() {
            const audio = this.$refs.audio;

            audio.currentTime = 0;
            this.currentTime = 0;
            this.progress = 0;

            if (!this.isPlaying) {
                audio.play();
                this.isPlaying = true;
            }
        },


        seek(event) {
            if (!this.duration) return

            const bar = event.currentTarget
            const rect = bar.getBoundingClientRect()

            const clickX = event.clientX - rect.left
            const width = rect.width

            const percent = clickX / width
            const newTime = percent * this.duration

            this.$refs.audio.currentTime = newTime
            this.currentTime = newTime
        },

        startDrag(event) {
            this.isDragging = true
            this.updateByDrag(event)
        },

        stopDrag() {
            this.isDragging = false
        },

        drag(event) {
            if (!this.isDragging) return
            this.updateByDrag(event)
        },

        updateByDrag(event) {
            if (!this.duration) return

            const bar = event.currentTarget.closest('.progress-bar')
            const rect = bar.getBoundingClientRect()

            const clientX = event.clientX ?? event.touches?.[0].clientX
            const clickX = clientX - rect.left
            const width = rect.width

            const percent = Math.min(Math.max(clickX / width, 0), 1)
            const newTime = percent * this.duration

            this.$refs.audio.currentTime = newTime
            this.currentTime = newTime
        }
    }
}