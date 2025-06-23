import React from "react";
import Styles from "./card.module.css";
import Image from "next/image";
import shoppingCartImage from "../public/cart.svg";

const Card = () => {
    return (
        <div className={Styles.cardContainer}>
            <div className={Styles.cardContents}>
                <div className={Styles.image}></div>
                <div className={Styles.content}>
                    <p className={Styles.small}>serum for skin</p>
                    <h1 className={Styles.title}>
                        Healthy, premium skincare serum
                    </h1>
                    <p className={Styles.description}>
                        Lorem ipsum dolor sit amet consectetur, adipisicing
                        elit. Excepturi maxime dignissimos perferendis quod
                        mollitia officiis sit, obcaecati nemo incidunt iusto
                        voluptates, nobis consequuntur culpa corporis optio
                        recusandae assumenda explicabo? Dicta.
                    </p>
                    <div className={Styles.costContainer}>
                        <h2 className={Styles.discount}>$79.99</h2>
                        <p className={Styles.originalPrice}>$129.99</p>
                    </div>
                    <button className={Styles.button}>
                        <Image src={shoppingCartImage} alt="cart icon" />
                        <p className={Styles.cartText}>Add to cart</p>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Card;
