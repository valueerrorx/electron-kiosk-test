<template>
  <div id="toolbar" class="d-block p-1 pb-0 overflow-hidden">
    <button style="float: right;" title="KioskModus" @click="activateKiosk" class="btn btn-danger p-1 ms-2 mb-1 btn-sm">
      <img src="/src/assets/img/svg/shield-lock.svg" width="20" height="20" alt="">
    </button>
  </div>
  <div id="content"></div>
</template>

<script>
export default {
  data() {
    return {
      kiosk: false,
    };
  },
  mounted() {
    if (typeof window !== 'undefined' && window.ipcRenderer?.on) {
      window.ipcRenderer.on('attention', () => {
        const toolbar = document.getElementById('toolbar');
        if (toolbar) toolbar.style.backgroundColor = 'red';
        this.$swal({
          title: 'Achtung',
          text: 'Der KioskModus ist aktiv. Bitte bleiben Sie in der Anwendung.',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
        });
      });
    }
  },
  beforeUnmount() {
    if (typeof window !== 'undefined' && window.ipcRenderer?.removeAllListeners) {
      window.ipcRenderer.removeAllListeners('attention');
    }
  },
  methods: {
    activateKiosk() {
      const toolbar = document.getElementById('toolbar');
      if (this.kiosk) {
        this.$swal({
          title: 'KioskModus deaktivieren',
          text: 'Möchten Sie den KioskModus wirklich verlassen?',
          showCancelButton: true,
          confirmButtonText: 'Ok',
          cancelButtonText: 'Cancel',
        }).then((result) => {
          if (result.isConfirmed) {
            this.kiosk = false;
            window.ipcRenderer?.invoke('kioskmode', false);
          }
        });
      } else {
        this.$swal({
          title: 'KioskModus aktivieren',
          showCancelButton: true,
          confirmButtonText: 'Ok',
          cancelButtonText: 'Cancel',
        }).then((result) => {
          if (result.isConfirmed) {
            this.kiosk = true;
            window.ipcRenderer?.invoke('kioskmode', true);
            if (toolbar) toolbar.style.backgroundColor = '#1a4b1c';
          }
        });
      }
    },
  },
};
</script>
