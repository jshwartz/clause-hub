export default function(){
  this.transition(
    this.hasClass('librarynav-liquid'),

    // this makes our rule apply when the liquid-if transitions to the
    // true state.
    this.toValue(true),
    this.use('toRight', {duration: 250}),

    // which means we can also apply a reverse rule for transitions to
    // the false state.
    this.reverse('toLeft', {duration: 200})
  );
  this.transition(
    this.hasClass('template-menu'),

    // this makes our rule apply when the liquid-if transitions to the
    // true state.
    this.toValue(true),
    this.use('fade', {duration: 100}),

    // which means we can also apply a reverse rule for transitions to
    // the false state.
    this.reverse('fade', {duration: 100})
  );



};
