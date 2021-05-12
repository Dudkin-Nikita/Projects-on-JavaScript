const App = Vue.createApp({
    data() {
        return {
            attachment: {name: null, file: null},
            userName: '',
            currentPageFlag: 2,
            loading: false,
            aboutAuthor: false,
            getAccessToCreatebet: false,
            form: {
                title: '',
                description: '',
                date: '',
            },
            primarybets: [],
            bets: [],
            betFullInfo: [],
            betsSort: [],
        }
    },
    methods: {
        async createbet() {
            const {...bet} = this.form
            bet.date = formatData
            const newbet = await request('/api/bets', 'POST', bet)
            this.bets.push(newbet)
        },
        async checkAccessToCreatebet() {
            this.currentPageFlag = 1
            const result = await request('/api/checkAccess', 'GET')
            console.log(result)
            if (result != null) {
                this.getAccessToCreatebet = true;
            }
        },
        async handleFileUpload() {
            const formData = new FormData()
            formData.append('file', this.$refs.file.files[0])
            console.log(formData)
            const newbet = await requestImage('/api/betsImage', 'POST', formData)
        },
        mouseOver(i) {
            if (i === 1) {
                this.leftArrow = '/leftArrowRed.png'
            } else if (i === 2) {
                this.rightArrow = '/rightArrowRed.png'
            }

        },
        mouseLeave(i) {
            if (i === 1) {
                this.leftArrow = '/leftArrow.png'
            } else if (i === 2) {
                this.rightArrow = '/rightArrow.png'
            }
        },
    },
    async mounted() {
        this.loading = true;
        this.bets = await request('/api/bets')
        this.loading = false;
    }
})

export function formatData() {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dateObj = new Date()
    const month = dateObj.getMonth()
    const day = String(dateObj.getDate()).padStart(2, '0');
    const year = dateObj.getFullYear();
    return year + '-' + month + '-' + day
}

async function request(url, method = 'GET', data = null) {
    try {
        const headers = {}
        let body

        if (data) {
            headers['Content-Type'] = 'application/json'
            body = JSON.stringify(data)
        }

        const response = await fetch(url, {
            method,
            headers,
            body
        })
        return await response.json()
    } catch (e) {
        console.warn('Error:', e.message)
    }
}

async function requestImage(url, method = 'GET', data = null) {
    try {
        const headers = {}
        let body

        if (data) {
            headers['Content-Type'] = 'multipart/form-data'
            body = JSON.stringify(data)
        }

        const response = await fetch(url, {
            method,
            headers,
            body
        })
        return await response.json()
    } catch (e) {
        console.warn('Error:', e.message)
    }
}

App.component('loader', {
    template: `
    <div style="display: flex; justify-content: center;align-items: center; margin: 20px">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
  `
})
App.mount('#app')
