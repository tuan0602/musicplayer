const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const heading = $('header h2');
const cdThumb = $('.cd .cd-thumb');
const audio = $('#audio');
const playList = $('.playlist');
const playBtn = $('.btn-toggle-play');
const player = $('.player')
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const PlAYER_STORAGE_KEY = 'F8_PLAYER'
console.log(repeatBtn)
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    config: {},
    // (1/2) Uncomment the line below to use localStorage
    // config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
    songs: [{
            name: "Unstoppable",
            singer: "Sia ",
            path: "./music/Unstoppable-Sia-4312901.mp3",
            image: "./image/logo600.png"
        },
        {
            name: "Có hẹn Với thanh xuân",
            singer: "Monstar",
            path: "./music/cohenvoithanhxuan-MONSTAR-7050201.mp3",
            image: "./image/monstar.jpg"
        },
        {
            name: "Nevada",
            singer: "Monstercat",
            path: "./music/Nevada-Monstercat-6983746.mp3",
            image: "./image/logo600.png"
        }, {
            name: "Power In Your Soul",
            singer: "InteruptLunaLePage",
            path: "./music/PowerInYourSoul-InteruptLunaLePage-7043469.mp3",
            image: "./image/logo600.png"
        }, {
            name: "Way Back Home",
            singer: "SHAUN",
            path: "./music/WayBackHome-SHAUN-5564971.mp3",
            image: "./image/logo600.png"
        },
        {
            name: "Way Back Home",
            singer: "SHAUN",
            path: "./music/WayBackHome-SHAUN-5564971.mp3",
            image: "./image/logo600.png"
        }, {
            name: "Way Back Home",
            singer: "SHAUN",
            path: "./music/WayBackHome-SHAUN-5564971.mp3",
            image: "./image/logo600.png"
        }, {
            name: "Way Back Home",
            singer: "SHAUN",
            path: "./music/WayBackHome-SHAUN-5564971.mp3",
            image: "./image/logo600.png"
        }, {
            name: "Way Back Home",
            singer: "SHAUN",
            path: "./music/WayBackHome-SHAUN-5564971.mp3",
            image: "./image/logo600.png"
        }, {
            name: "Way Back Home",
            singer: "SHAUN",
            path: "./music/WayBackHome-SHAUN-5564971.mp3",
            image: "./image/logo600.png"
        },
    ],
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `  
            <div class="song ${index === this.currentIndex ? 'active': ''}" data-index="${index}">
                <div class="thumb" style="background-image:url('${song.image}')"></div>
                <div class="body">
                    <h3 class="titile">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option"><i class="fas fa-ellipsis-h"></i></div>
            </div> 
            `;
        });
        playList.innerHTML = htmls.join('\n');

    },
    handleEvents: function() {
        const _this = this;
        const cd = $('.cd');
        const cdWidth = cd.offsetWidth;
        // Xử lí cd quay và dừng
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000, //10s
            iterations: Infinity
        })
        cdThumbAnimate.pause();
        // Xử lí phóng to / thu nhỏ
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth

        };
        // Xử lí khi click play 
        playBtn.onclick = function() {
                if (_this.isPlaying) {
                    audio.pause()
                } else {
                    audio.play()
                }


                // khi song được play
                audio.onplay = function() {
                        _this.isPlaying = true;
                        player.classList.add('playing')
                        cdThumbAnimate.play()
                    }
                    // khi song được pause
                audio.onpause = function() {
                    _this.isPlaying = false;
                    player.classList.remove('playing')
                    cdThumbAnimate.pause()
                }
            }
            // khi tiến độ bài hát thay đổi vào
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent
            }
        }

        // Xử lí khi tua Song 
        progress.oninput = function(e) {
                const seekTime = audio.duration / 100 * e.target.value
                audio.currentTime = seekTime
            }
            // khi next Song
        nextBtn.onclick = function() {
                if (_this.isRandom) {
                    _this.playRandomSong();
                } else {
                    _this.nextSong();
                }
                audio.play();
                _this.render();
                _this.scrollToActiveSong();
            }
            // khi prev Song
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();

            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();

        }

        // Xử lí random bật / tắt song 
        randomBtn.onclick = function() {
                _this.setConfig('isRandom', _this.isRandom)
                _this.isRandom = !_this.isRandom;
                randomBtn.classList.toggle('active', _this.isRandom)

            }
            // Xử lí next song khi ended + random
        audio.onended = function() {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();

            }
            audio.play();
        }

        // Xử lí Repeat lại bài hát
        repeatBtn.onclick = function() {
                _this.isRepeat = !_this.isRepeat;
                _this.setConfig('isRepeat', _this.isRepeat)
                repeatBtn.classList.toggle('active', _this.isRepeat)
            }
            //Xử lí next song khi ended + repeat
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();

            }
            audio.play();
        }

        // Lắng nghe hành vi click
        playList.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')) {
                // xử lí khi click vào song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.render();
                    _this.loadCurrentSong();
                    audio.play();
                }
                // xử lí khi click vào song option
                if (!e.target.closest('.option')) {

                }
            }
        }

    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat

    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end',
                inline: "nearest"
            })
        }, 300)
    },
    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length)
            this.currentIndex = 0
        this.loadCurrentSong();
    },

    prevSong: function() {
        this.currentIndex--;
        if (this.currentIndex < 0)
            this.currentIndex = this.songs.length - 1;
        this.loadCurrentSong();
    },

    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path

    },
    start: function() {
        // gán cấu hình từ config vào ứng dụng
        this.loadConfig();
        // Lắng nghe / xử lí các sự kiện (DOM events)
        this.handleEvents();

        //Định nghĩa các thuộc tính cho object
        this.defineProperties();

        // Tải thông tin bài hát đầu tiên vào UI kho chạy ứng dụng
        this.loadCurrentSong();
        // Render playlist
        this.render();

        // hiển thị trạng thái ban đầu của chức năng
        randomBtn.classList.toggle('active', _this.isRandom)
        repeatBtn.classList.toggle('active', _this.isRepeat)
    },

}
app.start();