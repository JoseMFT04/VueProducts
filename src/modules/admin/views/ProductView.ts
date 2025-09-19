import { defineComponent, ref, watch, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMutation, useQuery } from '@tanstack/vue-query';
import { useFieldArray, useForm } from 'vee-validate';
import * as yup from 'yup';

import {
  createUpdateProductAction,
  getProductById,
  deleteProduct,
} from '@/modules/products/actions';
import CustomInput from '@/modules/common/components/CustomInput.vue';
import CustomTextArea from '@/modules/common/components/CustomTextArea.vue';
import { useToast } from 'vue-toastification';

const validationSchema = yup.object({
  title: yup.string().required().min(3, 'Minimo de 3 caracteres'),
  slug: yup.string().required(),
  description: yup.string().required(),
  price: yup
    .number()
    .required()
    .typeError('Este campo debe ser numerico')
    .moreThan(0, 'El precio debe ser mayor a 0'),
  stock: yup
    .number()
    .required()
    .typeError('Este campo debe ser numerico')
    .min(1, 'El precio debe ser mayor a 1'),
  gender: yup.string().required().oneOf(['men', 'women', 'kid'], 'Seleccione un campo valido'),
});

export default defineComponent({
  components: {
    CustomInput,
    CustomTextArea,
  },
  props: {
    productId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();
    const toast = useToast();

    const {
      data: product,
      isError,
      isLoading,
      refetch,
    } = useQuery({
      queryKey: ['product', props.productId],
      queryFn: () => getProductById(props.productId),
      retry: false,
    });

    const {
      mutate,
      isPending,
      isSuccess: isUpdateSuccess,
      data: updatedProduct,
    } = useMutation({
      mutationFn: createUpdateProductAction,
    });

    const { values, defineField, errors, handleSubmit, resetForm, meta } = useForm({
      validationSchema,
    });

    const [title, titleAttrs] = defineField('title');
    const [slug, slugAttrs] = defineField('slug');
    const [description, descriptionAttrs] = defineField('description');
    const [price, priceAttrs] = defineField('price');
    const [stock, stockAttrs] = defineField('stock');
    const [gender, genderAttrs] = defineField('gender');

    const { fields: sizes, remove: removeSize, push: pushSize } = useFieldArray<string>('sizes');

    const { fields: images } = useFieldArray<string>('images');
    const imageFiles = ref<File[]>([]);

    const onSubmit = handleSubmit(async (values) => {
      // const product = await createUpdateProductAction(value);
      // console.log(value);
      const formvalues = {
        ...values,
        images: [...values.images, ...imageFiles.value],
      };

      mutate(formvalues);
    });

    const onDelete = async () => {
      if (!props.productId) return;

      try {
        await deleteProduct(props.productId);
        toast.success('Producto eliminado correctamente');
        router.replace('/admin/products');
      } catch (error) {
        toast.error('Error deleting product');
        console.error(error);
      }
    };

    const toggleSize = (size: string) => {
      const currentSizes = sizes.value.map((s) => s.value);
      const hasSize = currentSizes.includes(size);

      if (hasSize) {
        removeSize(currentSizes.indexOf(size));
      } else pushSize(size);
    };

    const onFileChanged = (event: Event) => {
      const fileInput = event.target as HTMLInputElement;
      const fileList = fileInput.files;

      if (!fileList || fileList.length === 0) return;

      for (const imageFile of fileList) {
        imageFiles.value.push(imageFile);
      }
    };

    const hasSizes = (size: string) => {
      const currentSizes = sizes.value.map((s) => s.value);
      return currentSizes.includes(size);
    };

    const temporalImageUrl = (imageFile: File) => {
      return URL.createObjectURL(imageFile);
    };

    watchEffect(() => {
      if (isError.value && !isLoading.value) {
        router.replace('/admin/products');
        return;
      }
    });

    watch(
      product,
      () => {
        if (!product) return;
        resetForm({
          values: product.value,
        });
      },
      {
        deep: true,
        immediate: true,
      },
    );

    const route = useRoute();

    watch(isUpdateSuccess, (value) => {
      if (!value) return;

      if (route.path === '/admin/products/create') {
        toast.success('Producto creado correctamente');
      } else {
        toast.success('Producto actualizado correctamente');
      }

      router.replace(`/admin/products/${updatedProduct.value!.id}`);

      resetForm({
        values: updatedProduct.value,
      });
      imageFiles.value = [];
    });

    watch(
      () => props.productId,
      () => {
        refetch();
      },
    );

    return {
      // Properties
      values,
      errors,
      meta,

      title,
      titleAttrs,
      slug,
      slugAttrs,
      description,
      descriptionAttrs,
      price,
      priceAttrs,
      stock,
      stockAttrs,
      gender,
      genderAttrs,

      sizes,
      images,
      imageFiles,
      onFileChanged,

      isPending,

      // Getters
      allSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],

      // Actions
      onSubmit,
      onDelete,
      toggleSize,
      hasSizes,
      temporalImageUrl,
    };
  },
});
