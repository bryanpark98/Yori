import {
  IProduct,
  IProductOption,
  IProductOptionGroup,
  ProductOptionGroupType
} from '@yori/types/src/core/product';
import { generateTemporaryId } from '../../../utils/id_util';
import FormTextInput from '../../../components/FormTextInput/FormTextInput';
import { DropResult, DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import FloatingDeleteButton from '../../../components/FloatingDeleteButton/FloatingDeleteButton';
import FormLabel from '../../../components/FormLabel/FormLabel';
import FormSelect from '../../../components/FormSelect/FormSelect';
import FormTextArea from '../../../components/FormTextArea/FormTextArea';
import ImageSelector from '../../../components/ImageSelector/ImageSelector';
import FormFieldContainer from '../../../containers/FormFieldContainer/FormFieldContainer';
import FormSection from '../../../containers/FormSection/FormSection';
import Table from '../../../containers/Table/Table';
import styles from './ProductEditor.module.css';
import { GrDrag } from 'react-icons/gr';

export default function ProductEditor(props: {
  product: IProduct;
  onChange: (updatedProduct: IProduct) => void;
  onChangeImage: (imageFile: File) => void;
}) {
  const { product, onChange, onChangeImage } = props;

  function priceToString(dollarPrice: number): string {
    const formattedPrice: string = `$${dollarPrice.toFixed(2)}`;
    return formattedPrice;
  }

  function stringToPrice(formattedPrice: string): number {
    const strippedPriceString = formattedPrice.replace('$', '').replace('.', '');
    return Number(strippedPriceString.replace(/[^0-9]/g, '')) / 100;
  }

  function createNewOptionSection() {
    const newOptionSection = {
      id: generateTemporaryId(),
      name: '',
      type: 'Single' as ProductOptionGroupType,
      required: true,
      options: []
    };
    onChange({
      ...product,
      options: [...product.options, newOptionSection]
    });
  }

  function onChangeOptionSection(index: number, section: IProductOptionGroup) {
    onChange({
      ...product,
      options: product.options.map((optionSection, i) => {
        if (i === index) return section;
        return optionSection;
      })
    });
  }

  function createNewOption(optionSectionIndex: number) {
    onChangeOptionSection(optionSectionIndex, {
      ...product.options[optionSectionIndex],
      options: [
        ...product.options[optionSectionIndex].options,
        { id: generateTemporaryId(), name: '', dollarPrice: 0 }
      ]
    });
  }

  function onChangeOption(optionSectionIndex: number, optionIndex: number, option: IProductOption) {
    onChangeOptionSection(optionSectionIndex, {
      ...product.options[optionSectionIndex],
      options: product.options[optionSectionIndex].options.map((o, i) => {
        if (i === optionIndex) return option;
        return o;
      })
    });
  }

  function handleOptionSectionDragEnd(result: DropResult) {
    if (!result.destination) return; // Drop outside the list, do nothing

    const { source, destination } = result;

    // Logic to reorder the options within the product.options array
    const updatedOptions = [...product.options];
    const [movedOption] = updatedOptions.splice(source.index, 1);
    updatedOptions.splice(destination.index, 0, movedOption);

    // Update the state with the new order of options
    onChange({
      ...product,
      options: updatedOptions
    });
  }

  // TODO: fix option section drag and drop ()
  return (
    <>
      <ImageSelector imageUrl={product.imageUrl} onChange={onChangeImage} />
      <FormTextInput
        label="Name"
        placeholder='e.g. "Cheeseburger"'
        value={product.name}
        onChange={(value) => onChange({ ...product, name: value })}
      />
      <FormTextArea
        label="Description"
        placeholder='e.g. "A delicious cheeseburger with a side of fries"'
        value={product.description || ''}
        onChange={(value) => onChange({ ...product, description: value })}
      />
      {/* TODO: price cursor jumps around after decimal */}
      <FormTextInput
        label="Product Price"
        value={priceToString(product.dollarPrice)}
        onChange={(value) => {
          onChange({ ...product, dollarPrice: stringToPrice(value) });
        }}
      />
      <FormFieldContainer>
        <FormLabel label="Product options" />
        <div className={styles.optionSectionsContainer}>
          <DragDropContext onDragEnd={handleOptionSectionDragEnd}>
            <Droppable droppableId="option-sections">
              {(provided) => (
                <div
                  className={styles.optionSectionsContainer}
                  ref={provided.innerRef}
                  {...provided.droppableProps}>
                  {product.options?.map((option, index) => (
                    <Draggable
                      key={`option-section-${option.id}`}
                      draggableId={`option-section-${option.id}`}
                      index={index}>
                      {(provided) => (
                        <div
                          className={styles.optionSectionContainer}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}>
                          <FormSection>
                            <FloatingDeleteButton
                              onClick={() => {
                                onChange({
                                  ...product,
                                  options: product.options.filter((_, i) => i !== index)
                                });
                              }}
                            />
                            <FormTextInput
                              label="Option section name"
                              value={option.name}
                              placeholder='e.g. "Spice level"'
                              onChange={(name) => {
                                onChangeOptionSection(index, { ...option, name });
                              }}
                            />
                            <FormSelect
                              label="Option type"
                              value={option.type}
                              options={['Single', 'Multiple']}
                              onChange={(type) => {
                                onChangeOptionSection(index, {
                                  ...option,
                                  type: type as ProductOptionGroupType
                                });
                              }}
                            />
                            <Table
                              rowHorizontalPadding="0.5rem"
                              rowVerticalPadding="0.5rem"
                              columns={[
                                { field: 'drag', headerName: '' },
                                { field: 'name', headerName: 'Option name', width: '60%' },
                                { field: 'price', headerName: 'Option price', width: '40%' }
                              ]}
                              draggable
                              onDragRow={(sourceIndex, destinationIndex) => {
                                const updatedOptions = [...option.options];
                                const [movedOption] = updatedOptions.splice(sourceIndex, 1);
                                updatedOptions.splice(destinationIndex, 0, movedOption);
                                onChangeOptionSection(index, {
                                  ...option,
                                  options: updatedOptions
                                });
                              }}
                              rows={option.options.map((option, optionIndex) => {
                                return {
                                  key: option.id,
                                  data: {
                                    drag: (
                                      <div className={styles.dragHandle}>
                                        <GrDrag />
                                      </div>
                                    ),
                                    name: (
                                      <FormTextInput
                                        value={option.name}
                                        onChange={(value) => {
                                          onChangeOption(index, optionIndex, {
                                            ...option,
                                            name: value
                                          });
                                        }}
                                      />
                                    ),
                                    price: (
                                      <FormTextInput
                                        value={priceToString(option.dollarPrice)}
                                        onChange={(value) => {
                                          onChangeOption(index, optionIndex, {
                                            ...option,
                                            dollarPrice: stringToPrice(value)
                                          });
                                        }}
                                      />
                                    )
                                  }
                                };
                              })}
                            />
                            <a onClick={() => createNewOption(index)}>Add new option</a>
                          </FormSection>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <a onClick={createNewOptionSection}>Add new option section</a>
        </div>
      </FormFieldContainer>
    </>
  );
}
