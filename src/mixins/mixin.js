let MyMixin = {
  data() {
    return {
      apiUrl : 'https://api.geocollections.info',
      fileUrl :  'http://files.geocollections.info',
      lang: '',
    }
  },
/*  watch: {
    lang: {
      handler: function(val, oldVal) {
        console.log(this.lang) // call it in the context of your component object
      },
      deep: true
    }
  },*/

  methods:{
    setLangChanged (lang) {
      this.lang = lang
    },
    isDefinedAndNotEmpty(value) {
      return !!value && value.length > 0
    },
    isDefinedAndNotNull(value) {
      return !!value && value !== null
    },
    getRequest(url, isCount = false){
      return new Promise((resolve, reject) => {
        this.$http.get(url).then(response => {
          if (response.status === 200) {
            isCount ? resolve( response.body.count) : resolve( response.body.results)
          } else {
            //
            this.handleError()
          }
        }, errResponse => {
          console.log('ERROR: ' + JSON.stringify(errResponse));
          reject(errResponse)
        });
      })
    },
    handleError() {}
  },
  openInNewWindow(params) {
    if (typeof (params.width) === 'undefined') {
      params.width = 500;
    }
    if (typeof (params.height) === 'undefined') {
      params.height = 500;
    }
    window.open(location.origin + '/' + params.object, '', 'width=' + params.width +
      ',height=' + params.height,scrollbars, resizable)
  },
};
export default MyMixin;