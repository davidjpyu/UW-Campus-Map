package sets;

import java.util.List;

/**
 * Represents an immutable set of points on the real line that is easy to
 * describe, either because it is a finite set, e.g., {p1, p2, ..., pN}, or
 * because it excludes only a finite set, e.g., R \ {p1, p2, ..., pN}. As with
 * FiniteSet, each point is represented by a Java float with a non-infinite,
 * non-NaN value.
 */
public class SimpleSet {

  // the set is stored in a FiniteSet, where its values are in a sorted order.
  // Use a boolean to remember whether we are using the set's complement.
  //
  // RI: -infinity < set.getPoints.get(0) < set.getPoints.get(1) < ... < set.getPoints.get(set.size()-1) < +infinity
  // AF(this) = set if IsComplement = false, AF(this) = R \ set if IsComplement = true.
  private final FiniteSet set;
  private final boolean IsComplement;

  /**
   * Creates a simple set containing only the given points.
   * @param vals Array containing the points to make into a SimpleSet
   * @spec.requires points != null and has no NaNs, no infinities, and no dups
   * @spec.effects this = {vals[0], vals[1], ..., vals[vals.length-1]}
   */
  public SimpleSet(float[] vals) {
    this.set = FiniteSet.of(vals);
    this.IsComplement = false;
  }

  /**
   * Private constructor that directly fills in the fields above.
   * @param complement Whether this = points or this = R \ points
   * @param points List of points that are in the set or not in the set
   * @spec.requires points != null
   * @spec.effects this = R \ points if complement else points
   */
  private SimpleSet(boolean complement, FiniteSet points) {
    this.set = points;
    this.IsComplement = complement;
  }

  @Override
  public boolean equals(Object o) {
    if (!(o instanceof SimpleSet))
      return false;

    SimpleSet other = (SimpleSet) o;
    return this.set.equals(other.set) && (this.IsComplement == other.IsComplement);
  }

  @Override
  public int hashCode() {
    return super.hashCode();
  }

  /**
   * Returns the number of points in this set.
   * @return N      if this = {p1, p2, ..., pN} and
   *         infty  if this = R \ {p1, p2, ..., pN}
   */
  public float size() {
    // if condition: whether we are working with finite set (condition = false) or complement of finite set (condition = ture)
    if (this.IsComplement) {
      // if true, we are working with complement of finite set, size should be infty
      return Float.POSITIVE_INFINITY;
    } else {
      // if false, we are working with finite set, its size should be the size of its FiniteSet type.
      return this.set.size();
    }
  }

  /**
   * Returns a string describing the points included in this set.
   * @return the string "R" if this contains every point,
   *     a string of the form "R \ {p1, p2, .., pN}" if this contains all
   *        but {@literal N > 0} points, or
   *     a string of the form "{p1, p2, .., pN}" if this contains
   *        {@literal N >= 0} points,
   *     where p1, p2, ... pN are replaced by the individual numbers.
   */
  public String toString() {
    // case 1: this contains every point, where set.size() = 0 and IsComplement = true, directly print "R"
    // case 2: this contains no point, where set.size() = 0 and IsComplement = false, directly print "{}"
    // case 3: this contains infinite points, where set.size() > 0 and IsComplement = true, print
    //         "R \ {setList[0], setList[1], ... , setList[length-1], ", then delete the last ", ", add "}" to the end,
    //         so it becomes "R \ {setList[0], setList[1], ... , setList[length-1]}"
    // case 4: this contains finite points, where set.size() > 0 and IsComplement = false, print
    //         "{setList[0], setList[1], ... , setList[length-1], ", then delete the last ", ", add "}" to the end, so
    //         it becomes "{setList[0], setList[1], ... , setList[length-1]}"
    if (this.set.size() == 0) {
      if (this.IsComplement) {
        return "R";
      } else {
        return "{}";
      }
    } else {
      List setList = this.set.getPoints();
      StringBuilder output = new StringBuilder();
      if (this.IsComplement) {
        output.append("R \\ {");
      } else {
        output.append("{");
      }
      // Inv: output.toString() = "R \ {setList[0], setList[1], ... , setList[i-1], " if this.IsComplement = true
      //                        = "{setList[0], setList[1], ... , setList[i-1], " if this.IsComplement = false
      for (int i = 0; i < this.set.size(); i++) {
        output.append(setList.get(i));
        output.append(", ");
      }
      output.delete(output.length()-2, output.length());
      output.append("}");
      return output.toString();
    }
  }

  /**
   * Returns a set representing the points R \ this.
   * @return R \ this
   */
  public SimpleSet complement() {
    // its finite set remains, but its boolean field IsComplement turned opposite
    // if this is a finite set, its complement would be the same finite set with IsComplement = true,
    //    representing complement of the finite set
    // if this is the complement of a finite set, its complement would be the same finite set with IsComplement = false,
    //    representing the finite set itself.
    return new SimpleSet(!this.IsComplement, this.set);
  }

  /**
   * Returns the union of this and other.
   * @param other Set to union with this one.
   * @spec.requires other != null
   * @return this union other
   */
  public SimpleSet union(SimpleSet other) {
    // if this SimpleSet and other SimpleSet are both finite sets
    if (!this.IsComplement && !other.IsComplement) {
      // return the union of both sets
      return new SimpleSet(false, this.set.union(other.set));
    // if this SimpleSet and other SimpleSet are both complement of finite sets
    } else if (this.IsComplement && other.IsComplement) {
      // return the complement of the intersection of both's finite sets
      return new SimpleSet(true, this.set.intersection(other.set));
    // if this SimpleSet is a complement of a finite set and other SimpleSet is a finite set
    } else if (this.IsComplement && !other.IsComplement) {
      // return the complement of the difference of this's finite set from other's finite set.
      return new SimpleSet(true, this.set.difference(other.set));
    // if this SimpleSet is a finite set and other SimpleSet is a complement of finite set
    } else {
      // return the complement of the difference of other's finite set from this's finite set.
      return new SimpleSet(true, other.set.difference(this.set));
    }
  }

  /**
   * Returns the intersection of this and other.
   * @param other Set to intersect with this one.
   * @spec.requires other != null
   * @return this intersect other
   */
  public SimpleSet intersection(SimpleSet other) {
    // Set S1 to be the finite set of this, and C2 to be the complement set of S1
    // Set S2 to be the finite set of other, and C2 to be the complement set of S2
    // Case 1: this SimpleSet and other SimpleSet are both finite sets, which means this = S1 and other = S2.
    //         To get S1 ∩ S2, we can first get complement sets of S1 and S2, which are C1 and C2, union them, getting
    //         C1 U C2. Lastly get a complement of C1 U C2, because by DeMorgan's laws, Complement(C1 U C2) = S1 ∩ S2.
    // Case 2: this SimpleSet and other SimpleSet are both complement sets, which means this = C1 and other = C2.
    //         To get C1 ∩ C2, we can first get complement of complement sets, which are finite sets S1 and S2, union
    //         them, getting S1 U S2. Lastly get a complement of S1 U S2, because by DeMorgan's laws,
    //         Complement(S1 U S2) = C1 ∩ C2.
    // Case 3: this SimpleSet is complement set and other SimpleSet is finite set, which means this = C1 and other = S2.
    //         To get C1 ∩ S2, we can first get complement sets of C1 and S2, which are S1 and C2, union them, getting
    //         S1 U C2. Lastly get a complement of S1 U C2, because by DeMorgan's laws, Complement(S1 U C2) = C1 ∩ S2.
    // Case 4: this SimpleSet is finite set and other SimpleSet is complement set, which means this = S1 and other = C2.
    //         To get S1 ∩ C2, we can first get complement sets of S1 and C2, which are C1 and S2, union them, getting
    //         C1 U S2. Lastly get a complement of C1 U S2, because by DeMorgan's laws, Complement(C1 U S2) = S1 ∩ C2.
    return this.complement().union(other.complement()).complement();
  }

  /**
   * Returns the difference of this and other.
   * @param other Set to difference from this one.
   * @spec.requires other != null
   * @return this minus other
   */
  public SimpleSet difference(SimpleSet other) {
    // Set S1 to be the finite set of this, and C2 to be the complement set of S1
    // Set S2 to be the finite set of other, and C2 to be the complement set of S2
    // Case 1: this SimpleSet and other SimpleSet are both finite sets, which means this = S1 and other = S2.
    //         To get S1 \ S2, we can first get complement set of other, which is C2. Intersect S1 with C2, then we have
    //         S1 ∩ C2, which by definition of set difference, = S1 \ S2.
    // Case 2: this SimpleSet and other SimpleSet are both complement sets, which means this = C1 and other = C2.
    //         To get C1 \ C2, we can first get complement set of other, which is S2. Intersect C1 with S2, then we have
    //         C1 ∩ S2, which by definition of set difference, = C1 \ C2.
    // Case 3: this SimpleSet is complement set and other SimpleSet is finite set, which means this = C1 and other = S2.
    //         To get C1 \ S2, we can first get complement set of other, which is C2. Intersect C1 with C2, then we have
    //         C1 ∩ C2, which by definition of set difference, = C1 \ S2.
    // Case 4: this SimpleSet is finite set and other SimpleSet is complement set, which means this = S1 and other = C2.
    //         To get S1 \ C2, we can first get complement set of other, which is S2. Intersect S1 with S2, then we have
    //         S1 ∩ S2, which by definition of set difference, = S1 \ C2.
    return this.intersection(other.complement());
  }

}
