import PropTypes from "prop-types";
import React, { Fragment, useState, useEffect } from "react";
import Swiper from "react-id-swiper";
// import { getProductCartQuantity } from "../../helpers/product";
import { Modal } from "react-bootstrap";
import Rating from "./sub-components/ProductRating";
import { connect } from "react-redux";
import WebService from '../../util/webService';
import constant from '../../util/constant';
import { setLoader } from "../../redux/actions/loaderActions";

function ProductModal(props) {
  const { product, cartData, defaultStore, userData, finalproductprice, finaldiscountedprice, setLoader } = props;



  const [discountedPrice, setDiscountedPrice] = useState(finaldiscountedprice)
  const [productPrice, setProductPrice] = useState(finalproductprice)
  const [isDiscount, setIsDiscount] = useState(product.discounted)

  const [gallerySwiper, getGallerySwiper] = useState(null);
  const [thumbnailSwiper, getThumbnailSwiper] = useState(null);
  const [selectedProductColor, setSelectedProductColor] = useState([]);
  // const [productStock, setProductStock] = useState();
  const [quantityCount, setQuantityCount] = useState(1);

  // const wishlistItem = props.wishlistitem;
  // const compareItem = props.compareitem;

  const addToCart = props.addtocart;
  // const addToWishlist = props.addtowishlist;
  // const addToCompare = props.addtocompare;

  const addToast = props.addtoast;
  // const cartItems = props.cartitems;

  // const productCartQty = 0

  useEffect(() => {
    getDefualtsOption()
    if (
      gallerySwiper !== null &&
      gallerySwiper.controller &&
      thumbnailSwiper !== null &&
      thumbnailSwiper.controller
    ) {
      gallerySwiper.controller.control = thumbnailSwiper;
      thumbnailSwiper.controller.control = gallerySwiper;
    }
  }, [gallerySwiper, thumbnailSwiper]);

  const gallerySwiperParams = {
    getSwiper: getGallerySwiper,
    spaceBetween: 10,
    loopedSlides: 4,
    loop: false
  };

  const thumbnailSwiperParams = {
    getSwiper: getThumbnailSwiper,
    spaceBetween: 10,
    slidesPerView: 4,
    loopedSlides: 4,
    touchRatio: 0.2,
    freeMode: true,
    loop: false,
    slideToClickedSlide: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    },
    renderPrevButton: () => (
      <button className="swiper-button-prev ht-swiper-button-nav">
        <i className="pe-7s-angle-left" />
      </button>
    ),
    renderNextButton: () => (
      <button className="swiper-button-next ht-swiper-button-nav">
        <i className="pe-7s-angle-right" />
      </button>
    )
  };
  const getDefualtsOption = async () => {
    let temp = [];
    if (product.options) {
      product.options.map(async (item) => {
        item.optionValues.map(async (data) => {
          if (data.defaultValue) {
            temp.push({ 'name': item.name, 'id': data.id });
          }
        })
      })
      setSelectedProductColor(temp)
      getPrice(temp)
    }
  }
  const onChangeOptions = async (value, option) => {

    let tempSelectedOptions = [];
    let index;
    if (option.type === 'radio' || option.type === 'select') {
      index = selectedProductColor.findIndex(a => a.name === option.name);
    } else {
      index = selectedProductColor.findIndex(a => a.id === value.id);
    }

    if (index === -1) {
      let temp = [...selectedProductColor, { 'name': option.name, 'id': value.id }]
      tempSelectedOptions = temp;
      setSelectedProductColor(temp)
      // setSelectedProductColor([...selectedProductColor, { 'name': option.name, 'id': value.id }])
    } else {
      let temp = [...selectedProductColor]
      if (option.type === 'radio' || option.type === 'select') {
        temp[index] = { 'name': option.name, 'id': value.id };

      } else {
        temp.splice(index, 1);
      }
      tempSelectedOptions = temp;
      setSelectedProductColor(temp)
    }
    getPrice(tempSelectedOptions)
  }
  const getPrice = async (tempSelectedOptions) => {
    setLoader(true)
    let action = constant.ACTION.PRODUCT + product.id + '/' + constant.ACTION.PRICE;
    let param = { "options": tempSelectedOptions }
    try {
      let response = await WebService.post(action, param);
      if (response) {
        setDiscountedPrice(response.finalPrice);
        setProductPrice(response.originalPrice);
        setIsDiscount(response.discounted);
        setLoader(false)
      }
    } catch (error) {
      setLoader(false)
    }
  }
  const checkedOrNot = (value) => {
    let index = selectedProductColor.findIndex(a => a.id === value.id);
    if (index === -1) {
      return false
    } else {
      return true
    }
  }

  return (
    <Fragment>
      <Modal
        show={props.show}
        onHide={props.onHide}
        className="product-quickview-modal-wrapper"
      >
        <Modal.Header closeButton></Modal.Header>

        <div className="modal-body">
          <div className="row">
            <div className="col-md-5 col-sm-12 col-xs-12">
              <div className="product-large-image-wrapper">
                <Swiper {...gallerySwiperParams}>
                  {product.images.length > 0 &&
                    product.images.map((single, key) => {
                      return (
                        <div key={key}>
                          <div className="single-image">
                            <img
                              src={single.imageUrl}
                              className="img-fluid"
                              alt=""
                            />
                          </div>
                        </div>
                      );
                    })}
                </Swiper>
              </div>
              <div className="product-small-image-wrapper mt-15">
                <Swiper {...thumbnailSwiperParams}>
                  {product.images.length > 1 &&
                    product.images.map((single, key) => {
                      return (
                        <div key={key}>
                          <div className="single-image">
                            <img
                              src={single.imageUrl}
                              className="img-fluid"
                              alt=""
                            />
                          </div>
                        </div>
                      );
                    })}
                </Swiper>
              </div>
            </div>
            <div className="col-md-7 col-sm-12 col-xs-12">
              <div className="product-details-content quickview-content">
                <h2>{product.description.name}</h2>
                <div className="product-details-price">
                  {isDiscount ? (
                    <Fragment>
                      <span>
                        {discountedPrice}
                      </span>{" "}
                      <span className="old">
                        {productPrice}
                      </span>
                    </Fragment>
                  ) : (<span>{productPrice} </span>)}
                </div>

                <div className="pro-details-rating-wrap">
                  <div className="pro-details-rating">
                    <Rating ratingValue={product.rating} />
                  </div>
                </div>
                <div className="pro-details-list">
                  <p dangerouslySetInnerHTML={{ __html: product.description.description }}></p>
                </div>

                {product.options ? (
                  <div className="pro-details-size-color">
                    {
                      product.options.map((option, key) => {
                        return (
                          option.type === 'radio' &&
                          <div className="pro-details-color-wrap" key={key}>
                            <span>{option.name}</span>
                            <div className="pro-details-color-content" style={{ display: 'flex', flexDirection: 'column' }}>
                              {

                                option.optionValues.map((value, index) => {
                                  return (
                                    <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', margin: 15 }} key={index}>
                                      {value.image && <img src={value.image} alt="product-option" />}

                                      <label className={`pro-details-color-content--single`} style={{ backgroundColor: value.code }} key={index} >

                                        <input
                                          type={option.type}
                                          value={value.id}
                                          name={option.name}
                                          checked={checkedOrNot(value)}
                                          onChange={() => onChangeOptions(value, option)}
                                        />
                                        <span className="checkmark"></span>
                                      </label>
                                      <label>{value.description.name} {value.price && '(' + value.price + ')'}</label>
                                    </div>
                                  );
                                })
                                // )
                              }

                            </div>
                          </div>
                        )
                      })
                    }
                    {

                      product.options.map((option, index) => {
                        return (
                          option.type === 'select' &&
                          <div className="pro-details-size" key={index}>
                            <span>{option.name}</span>
                            <div className="pro-details-size-content">
                              {
                                <select onChange={(e) => { onChangeOptions(JSON.parse(e.target.value), option) }}>
                                  {/* <option>Select a country</option> */}
                                  {

                                    option.optionValues.map((singleSize, i) => {
                                      return <option key={i} value={JSON.stringify(singleSize)} selected={checkedOrNot(singleSize)}>{singleSize.description.name} {singleSize.price && '(' + singleSize.price + ')'}</option>
                                    })
                                  }
                                </select>

                              }
                            </div>
                          </div>
                        )
                      })
                    }
                    {

                      product.options.map((option, index) => {
                        return (
                          option.type === 'checkbox' &&
                          <div className="pro-details-size" key={index}>
                            <span>{option.name}</span>
                            <div className="pro-details-size-content" style={{ display: 'flex' }}>
                              {
                                option.optionValues.map((singleSize, key) => {
                                  return (
                                    <div style={{ flexDirection: 'column ', display: 'flex', alignItems: 'center', marginRight: 15 }} key={key}>
                                      {singleSize.image && <img src={singleSize.image} alt="product-option" />}

                                      <label className={`pro-details-size-content--single`} key={key}  >
                                        <input
                                          type="checkbox"
                                          value={singleSize.description.name}
                                          name={option.name}
                                          checked={checkedOrNot(singleSize)}
                                          onChange={() => {
                                            onChangeOptions(singleSize, option)
                                            // setSelectedProductSize(singleSize.name);
                                            //   setProductStock(singleSize.stock);
                                            //   setQuantityCount(1);
                                          }}
                                        />
                                        <span className="size-name">{singleSize.description.name} {singleSize.price && '(' + singleSize.price + ')'}</span>
                                      </label>
                                    </div>
                                  );

                                })}
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                ) : (
                    ""
                  )}
                {
                  //   product.affiliateLink ? (
                  //   <div className="pro-details-quality">
                  //     <div className="pro-details-cart btn-hover">
                  //       <a
                  //         href={product.affiliateLink}
                  //         rel="noopener noreferrer"
                  //         target="_blank"
                  //       >
                  //         Buy Now
                  //       </a>
                  //     </div>
                  //   </div>
                  // ) : (
                  <div className="pro-details-quality">
                    <div className="cart-plus-minus">
                      <button onClick={() => setQuantityCount(quantityCount > 1 ? quantityCount - 1 : 1)} className="dec qtybutton">
                        -
                      </button>
                      <input className="cart-plus-minus-box" type="text" value={quantityCount} readOnly />
                      <button onClick={() => setQuantityCount(quantityCount < product.quantity ? quantityCount + 1 : quantityCount)} className="inc qtybutton" >
                        +
                      </button>
                    </div>
                    <div className="pro-details-cart btn-hover">
                      {product.available && product.canBePurchased && product.visible && product.quantity > 0 ? (
                        <button
                          onClick={() => {
                            let options = [];
                            selectedProductColor.map((a) => {
                              options.push({ id: a.id })
                            })
                            addToCart(
                              product,
                              addToast,
                              cartData,
                              quantityCount,
                              defaultStore,
                              userData,
                              options
                              // selectedProductColor,
                              // selectedProductSize
                            )
                          }
                          }>Add To Cart</button>
                      ) : (
                          <button disabled>Out of Stock</button>
                        )}
                    </div>
                    {/* <div className="pro-details-wishlist">
                        <button
                          className={wishlistItem !== undefined ? "active" : ""}
                          disabled={wishlistItem !== undefined}
                          title={
                            wishlistItem !== undefined
                              ? "Added to wishlist"
                              : "Add to wishlist"
                          }
                          onClick={() => addToWishlist(product, addToast)}
                        >
                          <i className="pe-7s-like" />
                        </button>
                      </div> */}
                    {/* <div className="pro-details-compare">
                        <button
                          className={compareItem !== undefined ? "active" : ""}
                          disabled={compareItem !== undefined}
                          title={
                            compareItem !== undefined
                              ? "Added to compare"
                              : "Add to compare"
                          }
                          onClick={() => addToCompare(product, addToast)}
                        >
                          <i className="pe-7s-shuffle" />
                        </button>
                      </div> */}
                  </div>
                  // )
                }
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </Fragment>
  );
}

ProductModal.propTypes = {
  addtoast: PropTypes.func,
  addtocart: PropTypes.func,
  // addtocompare: PropTypes.func,
  // addtowishlist: PropTypes.func,
  // cartitems: PropTypes.array,
  // compareitem: PropTypes.object,
  // currency: PropTypes.object,
  // discountedprice: PropTypes.number,
  finaldiscountedprice: PropTypes.string,
  finalproductprice: PropTypes.string,
  onHide: PropTypes.func,
  product: PropTypes.object,
  show: PropTypes.bool

  // wishlistitem: PropTypes.object
};

const mapStateToProps = state => {
  return {
    // cartitems: state.cartData
  };
};
const mapDispatchToProps = dispatch => {
  return {
    setLoader: (value) => {
      dispatch(setLoader(value));
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ProductModal);
