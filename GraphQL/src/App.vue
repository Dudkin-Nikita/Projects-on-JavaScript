<template>
  <div id="app">
    <div style="margin: 0 20% 0 20%">
      <form  enctype="multipart/form-data">
        <h2>Create bet</h2>
        <div class="input-field">
          <input id="betName" type="text" name="title" required placeholder="bet name" v-model="form.title">
        </div>
        <div class="input-field">
        <textarea id="messagebet" type="text" name="message" required placeholder="bet description"
                  style="resize:vertical;
        min-height:150px" v-model="form.message"
        ></textarea>
        </div>
        <p>
          <label>
            <input name="status_order" id="shipped" type="radio" value="Shipped" v-model="form.status" checked/>
            <span>Shipped</span>
          </label>
        </p>
        <p>
          <label>
            <input name="status_order" id="cancelled" type="radio" value="Cancelled" v-model="form.status"/>
            <span>Cancelled</span>
          </label>
        </p>
        <div>
          <input id="date" type="date" class="datepicker" max="2022-01-09" name="date" required v-model="form.date">
        </div>
        <button @click.prevent="createbet" type="submit" class="btn" style="margin-top:20px;">Create</button>
      </form>

      <button style="margin-top: 30px" type="submit" @click="getbets" class="btn">Open bets</button>
    </div>
    <div style="margin: auto" v-if="bets.length !== 0">
      <table style="margin: auto;width: 730px; margin-top: 20px">
        <tr>
          <th onclick="sortTable(1)">Title</th>
          <th onclick="sortTable(2)">Message</th>
          <th onclick="sortTable(3)">Status</th>
          <th onclick="sortTable(4)">Date</th>
        </tr>
        <tr v-for="(bet) in bets" v-bind:key="bet">
          <td>{{ bet.title }}</td>
          <td>{{ bet.message }}</td>
          <td>{{ bet.status }}</td>
          <td>{{ bet.date }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script>
import axios from 'axios'

export default {
  name: 'App',
  data() {
    return {
      showbetsFlag: false,
      numberbets: 0,
      form: {
        title: '',
        message: '',
        status: '',
        date: '',
      },
      bets: [],
      newbet: null
    }
  },
  methods: {
    async createbet() {
      let title = this.form.title
      let message = this.form.message
      let status = this.form.status
      let date = this.form.date

      try {
        const res = await axios.post(
            'http://localhost:4000/graphql', {
              query: `mutation createbet($title: String!, $message: String!, $status: String!, $date: String!) {
                      createbet(title: $title, message: $message, status: $status, date: $date) {
                        title
                        message
                        status
                        date
                      }
              }`,
              variables: {
                title: title,
                message: message,
                status: status,
                date: date,
              }
            })
        this.newbet = res.data.data
        console.log(this.newbet)
      } catch (e) {
        console.log('err', e)
      }
    },
    async getbets() {
      this.numberbets = 0
      this.showbetsFlag = true;
      try {
        const res = await axios.post(
            'http://localhost:4000/graphql', {
              query: `{
                getAllbets {
                  title
                  message
                  status
                  date
                }
               }`
            })
        this.bets = res.data.data.getAllbets
        console.log(res.data.data.getAllbets)
      } catch (e) {
        console.log('err', e)
      }
    }

  }
}
</script>