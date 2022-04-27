import {
  Button,
  FormControl,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Progress,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { db } from "../firebase/firebase-config";

export const ModalEditProducts = ({
  isOpen,
  onClose,
  setIsLoading,
  register,
  handleSubmit,
  reset
}) => {
  const [urlImage, setUrlImage] = useState("");
  const [image, setImage] = useState("");
  const [progress, setProgress] = useState(0);

  const onSubmit = async (data) => {
    setIsLoading(true);
    await setDoc(doc(db, "article", data.product), {
      product: data.product,
      price: data.price,
      urlImage: urlImage,
    });
    setIsLoading(false);
    setUrlImage("");
    setProgress(0);
    reset();
    onClose();
  };

  const handleUploadAnImage = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setImage(file);
    const urlImage = "";
    if (file.type.includes("image")) {
      const task = uploadImage(file);

      task.on(
        "state_changed",
        (snapshot) => {
          const percentage =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(percentage);
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(task.snapshot.ref).then((url) => {
            setUrlImage(url);
          });
        }
      );
    } else {
      console.log("no es una imagen");
    }
    return urlImage;
  };

  return (
    <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <FormControl>
              <input {...register("product")} placeholder="product" />
            </FormControl>
            <FormControl>
              <input {...register("price")} placeholder="price" type="phone" />
            </FormControl>
            {urlImage ? (
              <img src={urlImage} alt="image" />
            ) : (
              <>
                <Textarea
                  name="description"
                  onDrop={handleUploadAnImage}
                  id="file"
                  cols="30"
                  rows="10"
                ></Textarea>
                <Progress value={progress} />
              </>
            )}
          </ModalBody>

          <ModalFooter>
            <HStack width="100%" justifyContent="space-between">
              <Button variant="ghost" onClick={onClose}>
                Cerrar
              </Button>
              <Button colorScheme="blue" mr={3} type="submit">
                Guardar
              </Button>
            </HStack>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
