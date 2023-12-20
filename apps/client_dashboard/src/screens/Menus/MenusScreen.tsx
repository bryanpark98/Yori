import { IMenu } from '@yori/types/src/core/menu';
import moment from 'moment';
import { IProduct } from '@yori/types/src/core/product';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FormButton from '../../components/FormButton/FormButton';
import FormImage from '../../components/FormImage/FormImage';
import FormLabel from '../../components/FormLabel/FormLabel';
import FormSelect from '../../components/FormSelect/FormSelect';
import FormTextInput from '../../components/FormTextInput/FormTextInput';
import FormTimeInput from '../../components/FormTimeInput/FormTimeInput';
import HorizontalSeparator from '../../components/HorizontalSeparator/HorizontalSeparator';
import { NavigationBarPage } from '../../components/NavigationBar/NavigationBar';
import FormFieldContainer from '../../containers/FormFieldContainer/FormFieldContainer';
import Modal from '../../containers/Modal/Modal';
import Page from '../../containers/Page/Page';
import Table from '../../containers/Table/Table';
import { Menu, Restaurant } from '../../utils/api';
import { generateTemporaryId } from '../../utils/id_util';
import styles from './MenusScreen.module.css';
import Collapsible from '../../containers/Collapsible/Collapsible';
import FloatingDeleteButton from '../../components/FloatingDeleteButton/FloatingDeleteButton';
import { DragDropContext, Draggable, DropResult, Droppable } from 'react-beautiful-dnd';

type MenuData = { new: boolean; edited: boolean; menu: IMenu };

export default function MenusScreen() {
  const { restaurantId } = useParams();

  // TODO: show 404 page
  if (restaurantId === undefined) throw new Error('restaurantId is undefined');

  const [menus, setMenus] = useState<MenuData[]>([]);
  const [saving, setSaving] = useState(false);

  const [products, setProducts] = useState<IProduct[]>([]);
  // TODO: this data struct can be improved
  const [addProductInfo, setAddProductInfo] = useState<{
    menuIndex: number;
    sectionIndex: number;
  } | null>(null);

  const fetchRestaurant = async () => {
    const response = await Restaurant.readPrivate(restaurantId);
    const fetchedMenus = response.restaurant.menus.map((menu) => ({
      new: false,
      edited: false,
      deleted: false,
      menu
    }));
    setMenus(fetchedMenus);

    const productsResponse = await Restaurant.readProducts(restaurantId);
    setProducts(productsResponse.products);
  };

  useEffect(() => {
    fetchRestaurant();
  }, [restaurantId]);

  const convertMsmToString = (minutes: number) => {
    return moment().startOf('day').add(minutes, 'minutes').format('HH:mm');
  };

  const convertStringToMsm = (time: string) => {
    const timeMoment = moment(time, 'HH:mm');
    const minutesSinceMidnight = timeMoment.diff(moment().startOf('day'), 'minutes');
    return minutesSinceMidnight;
  };

  const setMenu = (index: number, updatedMenu: IMenu) => {
    const menusClone = [...menus];
    menusClone[index].edited = true;
    menusClone[index].menu = updatedMenu;
    setMenus(menusClone);
  };

  const deleteMenu = (index: number) => {
    const menusClone = [...menus];
    menusClone[index].edited = true;
    menusClone[index].menu.deleted = true;
    setMenus(menusClone);
  };

  const saveChanges = async () => {
    setSaving(true);
    for (const menuData of menus) {
      if (menuData.new) {
        await Menu.create(menuData.menu);
      } else if (menuData.edited) {
        await Menu.update(menuData.menu);
      }
    }
    await fetchRestaurant();
    setSaving(false);
  };

  const addMenu = async () => {
    setMenus([
      {
        new: true,
        edited: false,
        menu: {
          id: generateTemporaryId(),
          name: 'New menu',
          menuSections: [],
          hours: { opensAtMinutes: 0, closesAtMinutes: 0 },
          restaurantId,
          published: false,
          deleted: false
        }
      },
      ...menus
    ]);
  };

  const setMenuSection = (
    menuIndex: number,
    menuSectionIndex: number,
    updatedMenuSection: IMenu['menuSections'][0]
  ) => {
    const menusClone = [...menus];
    menusClone[menuIndex].edited = true;
    menusClone[menuIndex].menu.menuSections[menuSectionIndex] = updatedMenuSection;
    setMenus(menusClone);
  };

  const onDragMenuSectionEnd = (menuIndex: number, result: DropResult) => {
    if (!result.destination) return;
    const { source, destination } = result;
    const menusClone = [...menus];
    menusClone[menuIndex].edited = true;
    const [removed] = menusClone[menuIndex].menu.menuSections.splice(source.index, 1);
    menusClone[menuIndex].menu.menuSections.splice(destination.index, 0, removed);
    setMenus(menusClone);
  };

  const onDragMenuSectionItemEnd = (
    menuIndex: number,
    menuSectionIndex: number,
    result: DropResult
  ) => {
    if (!result.destination) return;
    const { source, destination } = result;
    const menusClone = [...menus];
    menusClone[menuIndex].edited = true;
    const [removed] = menusClone[menuIndex].menu.menuSections[menuSectionIndex].menuItems.splice(
      source.index,
      1
    );
    menusClone[menuIndex].menu.menuSections[menuSectionIndex].menuItems.splice(
      destination.index,
      0,
      removed
    );
    setMenus(menusClone);
  };

  // TODO: fix janky drag and drop
  const MenuSectionItems = (menuIndex: number, menuSectionIndex: number) => {
    return (
      <DragDropContext
        onDragEnd={(value) => onDragMenuSectionItemEnd(menuIndex, menuSectionIndex, value)}>
        <Droppable droppableId="droppable" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={styles.menuSectionItemsContainer}>
              {menus[menuIndex].menu.menuSections[menuSectionIndex].menuItems.map(
                (menuItem, menuItemIndex) => {
                  return (
                    <Draggable key={menuItem.id} draggableId={menuItem.id} index={menuItemIndex}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          key={menuItem.id}
                          className={styles.menuSectionItem}>
                          <FloatingDeleteButton
                            onClick={() => {
                              setMenuSection(menuIndex, menuSectionIndex, {
                                ...menus[menuIndex].menu.menuSections[menuSectionIndex],
                                menuItems: menus[menuIndex].menu.menuSections[
                                  menuSectionIndex
                                ].menuItems.filter((item) => item.id !== menuItem.id)
                              });
                            }}
                          />
                          <img src={menuItem.imageUrl} className={styles.menuSectionItemImage} />
                          {menuItem.name} - ${menuItem.dollarPrice}
                        </div>
                      )}
                    </Draggable>
                  );
                }
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  };

  const MenuSections = (menuIndex: number) => {
    return (
      <DragDropContext onDragEnd={(value) => onDragMenuSectionEnd(menuIndex, value)}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {menus[menuIndex].menu.menuSections.map((menuSection, menuSectionIndex) => {
                if (menuSection.deleted) return null;
                return (
                  <Draggable
                    key={menuSection.id}
                    draggableId={menuSection.id}
                    index={menuSectionIndex}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        key={menuSection.id}
                        className={styles.menuSection}>
                        <FloatingDeleteButton
                          onClick={() => {
                            setMenuSection(menuIndex, menuSectionIndex, {
                              ...menuSection,
                              deleted: true
                            });
                          }}
                        />
                        <Collapsible header={menuSection.name}>
                          <div className={styles.menuSectionInnerContainer}>
                            <FormTextInput
                              label="Section name"
                              value={menuSection.name}
                              onChange={(value) => {
                                setMenuSection(menuIndex, menuSectionIndex, {
                                  ...menuSection,
                                  name: value
                                });
                              }}
                            />
                            <FormFieldContainer>
                              <FormLabel label="Menu section items" />
                              {MenuSectionItems(menuIndex, menuSectionIndex)}
                              <a
                                onClick={() => {
                                  setAddProductInfo({
                                    menuIndex,
                                    sectionIndex: menuSectionIndex
                                  });
                                }}>
                                Add item
                              </a>
                            </FormFieldContainer>
                          </div>
                        </Collapsible>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  };

  return (
    <>
      <Page activePage={NavigationBarPage.Menus}>
        <div className={styles.container}>
          <h2>Menus</h2>
          <FormButton text="Add menu" onClick={addMenu} />
          <HorizontalSeparator />

          {menus.map((menuData, menuIndex) => {
            const { menu } = menuData;
            if (menu.deleted) return null;
            return (
              <div key={menu.id + menuIndex} className={styles.menuContainer}>
                <h3>{menu.name}</h3>
                <FormTextInput
                  label="Menu name"
                  value={menu.name}
                  onChange={(value) => {
                    setMenu(menuIndex, { ...menu, name: value });
                  }}
                />
                <FormFieldContainer>
                  <FormLabel label="Hours of service" />
                  <div className={styles.timeSpanContainer}>
                    <div>
                      <FormTimeInput
                        label="Opening time"
                        value={convertMsmToString(menu.hours?.opensAtMinutes)}
                        onChange={(value) => {
                          setMenu(menuIndex, {
                            ...menu,
                            hours: { ...menu.hours, opensAtMinutes: convertStringToMsm(value) }
                          });
                        }}
                      />
                    </div>
                    <div>to</div>
                    <div>
                      <FormTimeInput
                        label="Closing time"
                        value={convertMsmToString(menu.hours?.closesAtMinutes)}
                        onChange={(value) => {
                          setMenu(menuIndex, {
                            ...menu,
                            hours: { ...menu.hours, closesAtMinutes: convertStringToMsm(value) }
                          });
                        }}
                      />
                    </div>
                  </div>
                </FormFieldContainer>
                <FormSelect
                  label="Published"
                  value={menu.published ? 'Yes' : 'No'}
                  options={['Yes', 'No']}
                  onChange={(value) => {
                    setMenu(menuIndex, { ...menu, published: value === 'Yes' });
                  }}
                />
                <FormFieldContainer>
                  <FormLabel label="Menu sections" />
                  {MenuSections(menuIndex)}
                  <a
                    onClick={() => {
                      setMenu(menuIndex, {
                        ...menu,
                        menuSections: [
                          ...menu.menuSections,
                          {
                            id: generateTemporaryId(),
                            name: 'New section (e.g. Appetizers)',
                            menuItems: [],
                            deleted: false
                          }
                        ]
                      });
                    }}>
                    Add menu section
                  </a>
                </FormFieldContainer>
                <FormButton
                  text="Delete Menu"
                  onClick={() => {
                    deleteMenu(menuIndex);
                  }}
                />
                <HorizontalSeparator />
              </div>
            );
          })}
        </div>
      </Page>
      {menus.some((menu) => menu.edited || menu.new) && (
        <FormButton text={'Save Changes'} loading={saving} onClick={saveChanges} floating />
      )}
      {addProductInfo && (
        <Modal title="Add Product" onClose={() => setAddProductInfo(null)}>
          <div style={{ height: '1rem' }} />
          <Table
            rowVerticalPadding="0.5rem"
            rowHorizontalPadding="1rem"
            columns={[
              { field: 'image', headerName: '' },
              { field: 'name', headerName: 'Name', width: '40%' },
              { field: 'description', headerName: 'Description', width: '60%' }
            ]}
            rows={products.map((product) => {
              return {
                key: product.id,
                data: {
                  image: (
                    <div className={styles.productListImageContainer}>
                      <FormImage imageUrl={product.imageUrl} />
                    </div>
                  ),
                  name: product.name,
                  description: product.description
                },
                onClick: () => {
                  if (
                    menus[addProductInfo.menuIndex].menu.menuSections.some((section) =>
                      section.menuItems.some((item) => item.id === product.id)
                    )
                  ) {
                    alert('This product is already in the menu');
                    return;
                  }
                  const menusClone = [...menus];
                  menusClone[addProductInfo.menuIndex].edited = true;
                  menusClone[addProductInfo.menuIndex].menu.menuSections[
                    addProductInfo.sectionIndex
                  ].menuItems.unshift(product);
                  setAddProductInfo(null);
                }
              };
            })}
          />
        </Modal>
      )}
    </>
  );
}
