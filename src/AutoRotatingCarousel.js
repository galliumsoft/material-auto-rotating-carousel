import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import { grey } from '@material-ui/core/colors'
import withStyles from '@material-ui/core/styles/withStyles'
import { duration } from '@material-ui/core/styles/transitions'
import Fab from '@material-ui/core/Fab'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import Modal from '@material-ui/core/Modal'
import Fade from '@material-ui/core/Fade'
import Dots from 'material-ui-dots'
import classNames from 'classnames'
import Carousel from './SwipableCarouselView'
import { modulo } from './util'

const styles = {
  root: {
    '& > *:focus': {
      outline: 'none'
    }
  },
  content: {
    width: '60%',
    maxWidth: 700,
    height: 'calc(100% - 96px)',
    maxHeight: 600,
    margin: '-16px auto 0',
    position: 'relative',
    top: '50%',
    transform: 'translateY(-50%)'
  },
  contentMobile: {
    width: '100%',
    height: '100%',
    maxWidth: 'initial',
    maxHeight: 'initial',
    margin: 0,
    top: 0,
    transform: 'none',

    '& > $carouselWrapper': {
      borderRadius: 0
    }
  },
  arrow: {
    width: 48,
    height: 48,
    position: 'absolute',
    top: 'calc((100% - 96px) / 2 + 24px)'
  },
  arrowLeft: {
    left: -96
  },
  arrowRight: {
    right: -96
  },
  arrowIcon: {
    color: grey[700]
  },
  carouselWrapper: {
    overflow: 'hidden',
    borderRadius: 14,
    transform: 'scale(1.0)',
    background: 'transparent',
    height: '100%'
  },
  dots: {
    paddingTop: 0,
    margin: '-20px auto 0 auto'
  },
  dotsMobile: {
    paddingTop: 0
  },
  dotsMobileLandscape: {
    paddingTop: 10
  },
  footer: {
    marginTop: -42,
    width: '100%',
    position: 'relative',
    textAlign: 'center'
  },
  footerMobile: {
    marginTop: -62
  },
  footerMobileLandscape: {
    marginTop: -3,
    transform: 'translateY(-50vh)',
    display: 'inline-block',
    width: 'auto'
  },
  slide: {
    width: '100%',
    height: '100%'
  },
  slideMobile: {
    width: '100%',
    height: '100%'
  },
  carousel: {
    height: '100%'
  },
  carouselContainer: {
    height: '100%'
  },
  closed: {}
}

class AutoRotatingCarousel extends Component {
  state = {
    slideIndex: this.props.slidePosition?this.props.slidePosition:0
  }

  componentDidUpdate(prevProps){
  if(prevProps.slidePosition!==this.props.slidePosition){
    //Perform some operation
    this.setState({slideIndex: this.props.slidePosition}, this.onChange(this.props.slidePosition));
  }
}

  handleContentClick = (e) => e.stopPropagation() || e.preventDefault()

  handleChange = (slideIndex) => {
    this.setState({
      slideIndex
    }, this.onChange(slideIndex))
  }

  decreaseIndex () {
    const slideIndex = this.state.slideIndex - 1
    this.setState({
      slideIndex
    }, this.onChange(slideIndex))
  }

  increaseIndex () {
    const slideIndex = this.state.slideIndex + 1
    this.setState({
      slideIndex
    }, this.onChange(slideIndex))
  }

  onChange (slideIndex) {
    if (this.props.onChange) {
      this.props.onChange(modulo(slideIndex, this.props.children.length))
    }
  }

  render () {
    const {
      autoplay,
      children,
      classes,
      containerStyle,
      hideArrows,
      interval,
      landscape: landscapeProp,
      mobile,
      ModalProps,
      open,
      onClose,

    } = this.props
    const landscape = mobile && landscapeProp
    const islandscape = landscape?1:0
    const ismobile = mobile.toString()
    const transitionDuration = { enter: duration.enteringScreen, exit: duration.leavingScreen }
    const hasMultipleChildren = children.length != null

    const carousel = (
      <Carousel
        autoplay={open && autoplay && hasMultipleChildren}
        className={classes.carousel}
        containerStyle={{ height: '100%', ...containerStyle }}
        index={this.state.slideIndex}
        interval={interval}
        onChangeIndex={this.handleChange}
        slideClassName={classes.slide}
      >
        {
          React.Children.map(children, c => React.cloneElement(c, {
            ismobile,
            landscape
          }))
        }
      </Carousel>
    )

    return (
      <Modal
        className={classNames(classes.root, {
          [classes.rootMobile]: mobile
        })}
        open={open}
        onClose={onClose}
        BackdropProps={ModalProps ? { transitionDuration, ...ModalProps.BackdropProps } : { transitionDuration }}
        {...ModalProps}
      >
        <Fade
          appear
          in={open}
          timeout={transitionDuration}
        >
          <div
            className={classNames(classes.content, {
              [classes.contentMobile]: mobile
            })}
            onClick={this.handleContentClick}
          >
            <Paper
              elevation={mobile ? 0 : 1}
              className={classes.carouselWrapper}>
              {carousel}
            </Paper>
            <div style={landscape ? { minWidth: 300, maxWidth: 'calc(50% - 28px)', padding: 5, margin: 5, float: 'right' } : null}>
              <div
                className={classNames(classes.footer, {
                  [classes.footerMobile]: mobile,
                  [classes.footerMobileLandscape]: landscape
                })}
              >

                {
                  hasMultipleChildren &&
                  <Dots
                    count={children.length}
                    index={modulo(this.state.slideIndex, children.length)}
                    className={classNames(classes.dots, {
                      [classes.dotsMobile]: mobile,
                      [classes.dotsMobileLandscape]: landscape
                    })}
                    onDotClick={this.handleChange}
                  />
                }
              </div>
            </div>
            {!mobile && !hideArrows && hasMultipleChildren && (
              <div>
                <Fab
                  className={classNames(classes.arrow, classes.arrowLeft)}
                  onClick={() => this.decreaseIndex()}
                >
                  <ArrowBackIcon className={classes.arrowIcon} />
                </Fab>
                <Fab
                  className={classNames(classes.arrow, classes.arrowRight)}
                  onClick={() => this.increaseIndex()}
                >
                  <ArrowForwardIcon className={classes.arrowIcon} />
                </Fab>
              </div>
            )}
          </div>
        </Fade>
      </Modal>
    )
  }
}

AutoRotatingCarousel.defaultProps = {
  autoplay: true,
  interval: 3000,
  mobile: false,
  open: false,
  hideArrows: false,
}

AutoRotatingCarousel.propTypes = {
  /** If `false`, the auto play behavior is disabled. */
  autoplay: PropTypes.bool,

  /** Object for customizing the CSS classes. */
  classes: PropTypes.object.isRequired,
  /** Override the inline-styles of the carousel container. */
  containerStyle: PropTypes.object,
  /** Delay between auto play transitions (in ms). */
  interval: PropTypes.number,
  /** If `true`, slide will adjust content for wide mobile screens. */
  landscape: PropTypes.bool,
  /** If `true`, the screen width and height is filled. */
  mobile: PropTypes.bool,
  /** Properties applied to the [Modal](https://material-ui.com/api/modal/) element. */
  ModalProps: PropTypes.object,
  /** Fired when the index changed. Returns current index. */
  onChange: PropTypes.func,
  /** Fired when the gray background of the popup is pressed when it is open. */
  onClose: PropTypes.func,
  /** Custom control to increment or decrement. */
  slidePosition: PropTypes.number,
  /** Controls whether the AutoRotatingCarousel is opened or not. */
  open: PropTypes.bool,
  /** If `true`, the left and right arrows are hidden in the desktop version. */
  hideArrows: PropTypes.bool,

}

export default withStyles(styles)(AutoRotatingCarousel)
