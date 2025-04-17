import { Button } from "@/components/ui/button"
import { DialogHeader, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"

type ModalProps = {
  open: boolean,
  setOpen:  React.Dispatch<React.SetStateAction<boolean>>
}

const ProductCreationModal = ({ open, setOpen }: ModalProps) => {

  return (

    <Dialog open={open} onOpenChange={setOpen} modal={true}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{"Add New Product"}</DialogTitle>
          <DialogDescription>
            {"Fill in the details to add a new product."}
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Product Name</label>
            <Input placeholder="Premium E-book" />
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <Textarea
              className="resize-none h-20"
              placeholder="Describe your product"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Price</label>
              <Input
                type="number"
                placeholder="29.99"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{"Add Product"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ProductCreationModal;