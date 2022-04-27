import { useEffect, useState } from "react";
import {
  Text,
  Box,
  Button,
  Container,
  Image,
  Flex,
  VStack,
  Stack,
  HStack,
  SkeletonText,
} from "@chakra-ui/react";
import { nanoid } from "nanoid";
import { db, dbfirebase } from "../firebase/firebase-config";
import { collection, getDocs, onSnapshot, query } from "firebase/firestore";
import { useRouter } from "next/router";

const getData = async () => {
  const docRef = await getDocs(query(collection(db, dbfirebase.name)));
  return docRef.docs.map((item) => item.data());
};

export default function Home() {
  const [troley, setTroley] = useState([]);
  const [products, setProducts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const q = query(collection(db, dbfirebase.name));
    onSnapshot(q, (querySnapshot) => {
      const localproducts = [];
      querySnapshot.forEach((doc) => {
        localproducts.push({
          product: doc.data().product,
          price: doc.data().price,
          urlImage: doc.data().urlImage,
        });
      });
      setProducts(localproducts);
      localStorage.setItem("products", JSON.stringify(localproducts));
    });
    console.table(products);
  }, []);

  const handleAddToTroley = (product) => {
    if (troley.length === 0) {
      setTroley([...troley, { ...product, quantity: 1 }]);
    } else if (troley.length > 0) {
      let troleyItem = troley.find((item) => item.product === product.product);
      if (troleyItem) {
        troleyItem.quantity += 1;
        setTroley([...troley]);
      } else {
        setTroley([...troley, { ...product, quantity: 1 }]);
      }
    }
  };

  const handleRemoveAnArticleFromTroley = (product) => {
    let filterProducts = troley.filter(
      (item) => item.product === product.product
    );
    if (filterProducts[0]?.quantity === 1) {
      setTroley([...troley.filter((item) => item.product !== product.product)]);
    } else if (filterProducts[0]?.quantity > 1) {
      setTroley([
        ...troley.filter((item) => item.product !== product.product),
        { ...filterProducts[0], quantity: filterProducts[0].quantity - 1 },
      ]);
    }
  };

  const handleRemoveAllArticlesFromTroley = () => {
    setTroley([]);
  };

  const handleCompleteOrderWithWhatsApp = () => {
    let troleyProducts = troley.map((item) => {
      return `${item.product} ( x ${item.quantity}) ...$ ${
        item.price * item.quantity
      }`;
    });
    let sum = troley.reduce((acc, item) => acc + item.price * item.quantity, 0);
    let troleyProductsString = troleyProducts.join(", ") + `. Total ${sum}`;
    let troleyProductsStringWhatsApp = troleyProductsString.replace(
      / /g,
      "%20"
    );
    let troleyProductsStringWhatsAppUrl = troleyProductsStringWhatsApp.replace(
      /,/g,
      "%2C"
    );
    let url = `https://wa.me/+543401571936?text=Hola!%20Quiero%20comprar%20${troleyProductsStringWhatsAppUrl}`;
    router.replace(url);
  };

  return (
    <Container width="sm" backgroundColor="#ebebeb" minHeight="100vh">
      <Container>
        <Text as="h2" textAlign="center">
          Tienda
        </Text>
        {products?.length === 0 && (
          <VStack spacing={4}>
            <SkeletonText
              padding={3}
              noOfLines={7}
              spacing="4"
              width="100%"
              height="180px"
              shadow="md"
              borderWidth="1px"
              backgroundColor="#ffffff"
              borderRadius="lg"
              fadeDuration={0.1}
            />
          </VStack>
        )}

        <VStack spacing={4}>
          {products?.map((product) => (
            <Box
              width="100%"
              height="180px"
              shadow="md"
              borderWidth="1px"
              backgroundColor="#ffffff"
              borderRadius="lg"
              key={nanoid()}
            >
              <Text>{product.product}</Text>
              <Text color="#333333">
                {parseFloat(product.price).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </Text>
              <Flex justifyContent="center">
                {product.urlImage ? (
                  <Image
                    src={product.urlImage}
                    width="100px"
                    height="90px"
                    alt="product"
                  />
                ) : (
                  <p>No hay imagen</p>
                )}
              </Flex>
              <HStack justifyContent="space-between" width="80%" margin="auto">
                <Button
                  onClick={() => handleRemoveAnArticleFromTroley(product)}
                  variant="outline"
                >
                  -
                </Button>
                <Text>
                  {
                    troley.filter((item) => item.product === product.product)[0]
                      ?.quantity
                  }
                </Text>
                <Button
                  onClick={() => handleAddToTroley(product)}
                  variant="solid"
                >
                  +
                </Button>
              </HStack>
            </Box>
          ))}
        </VStack>
        {products?.length > 0 && (
          <>
            <Text marginTop={4} textAlign="right">
              Total:
              {troley
                .reduce(
                  (total, item) =>
                    (total +=
                      parseFloat(item?.price) * parseInt(item?.quantity)),
                  0
                )
                .toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
            </Text>
            <Stack align="center" marginTop={6}>
              <Button
                onClick={handleRemoveAllArticlesFromTroley}
                isDisabled={troley.length === 0}
                width="100%"
                variant="outline"
                colorScheme="stealth"
              >
                Vaciar carrito
              </Button>
              <Button onClick={handleCompleteOrderWithWhatsApp}>
                Completar pedido
              </Button>
            </Stack>
          </>
        )}
      </Container>
    </Container>
  );
}
